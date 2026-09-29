#!/usr/bin/env node
// Site Analyst — surveille romanmitride.fr et écrit ses comptes rendus dans le vault Obsidian (Site-Analytics/).
// Il ne parle jamais directement à Deneb : Obsidian est le seul canal d'échange.
//
//   node analyst.mjs check                 contrôle technique (sans Claude) ; n'écrit que s'il y a un problème
//   node analyst.mjs quotidien             chiffres bruts de la veille (sans Claude)
//   node analyst.mjs bilan [--force]       bilan bimensuel (1er et 15) et/ou mensuel (1er), analysé par Claude
//   node analyst.mjs demandes              traite les notes Site-Analytics/_demandes/*.md (statut: nouvelle)
//   node analyst.mjs run --periode=AAAA-MM-JJ:AAAA-MM-JJ   analyse à la demande (CLI)
//
// Configuration : .env à côté du script (UMAMI_PG, UMAMI_WEBSITE_ID, SITE, VAULT, GSC_KEY_FILE optionnel).
import { execFileSync, spawnSync } from 'node:child_process';
import { createSign } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import tls from 'node:tls';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const env = Object.fromEntries(readFileSync(join(HERE, '.env'), 'utf8').split('\n')
  .filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const SITE = process.env.SITE ?? env.SITE ?? 'https://romanmitride.fr'; // SITE=… en variable d'environnement : test de remontée de bug
const OUT = join(env.VAULT ?? '/home/prospector/vault', 'Site-Analytics');
const STATE = join(HERE, 'state');
mkdirSync(STATE, { recursive: true });

// ───────────────────────── utilitaires ─────────────────────────
const pad = (n) => String(n).padStart(2, '0');
const jour = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const now = () => new Date();
const heure = () => { const d = now(); return `${jour(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const log = (m) => console.log(`[${heure()}] ${m}`);
const write = (rel, content) => { const p = join(OUT, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, content); return p; };
const read = (rel) => { const p = join(OUT, rel); return existsSync(p) ? readFileSync(p, 'utf8') : null; };
const slug = (s) => s.replace(/[\/:#|^[\]\\"*?<>]/g, '-').replace(/[–—]/g, '-').slice(0, 70).trim();
const fm = (o) => '---\n' + Object.entries(o).map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.join(', ')}]` : v}`).join('\n') + '\n---\n\n';

function sql(q) {
  const out = execFileSync('psql', [env.UMAMI_PG, '-X', '-A', '-t', '-F', '\t', '-v', 'ON_ERROR_STOP=1', '-c', q], { encoding: 'utf8' });
  return out.split('\n').filter(Boolean).map((l) => l.split('\t'));
}
const W = `website_id = '${env.UMAMI_WEBSITE_ID}'`;
const periode = (a, b, t = '') => `${t}created_at >= '${jour(a)}' and ${t}created_at < '${jour(b)}'`;

// ───────────────────────── collecte Umami ─────────────────────────
const MOTEURS_IA = /chatgpt|openai|perplexity|gemini\.google|bard\.google|copilot|claude\.ai|you\.com|phind|mistral/i;

export function stats(a, b) {
  const P = periode(a, b), PE = periode(a, b, 'e.'), WE = `e.${W}`;
  const one = (q) => sql(q)[0]?.[0] ?? '0';
  const table = (q) => sql(q).map(([k, v]) => ({ k: k || '(direct)', v: Number(v) }));
  const ev = Object.fromEntries(table(`select event_name, count(*) from website_event where ${W} and ${P} and event_type = 2 group by 1 order by 2 desc`).map((r) => [r.k, r.v]));
  const sources = table(`select coalesce(nullif(referrer_domain,''),'(direct)'), count(distinct session_id) from website_event where ${W} and ${P} and event_type = 1 and coalesce(referrer_domain,'') not like '%romanmitride.fr' group by 1 order by 2 desc limit 15`);
  return {
    du: jour(a), au: jour(addDays(b, -1)),
    visiteurs: Number(one(`select count(distinct session_id) from website_event where ${W} and ${P}`)),
    visites: Number(one(`select count(distinct visit_id) from website_event where ${W} and ${P}`)),
    pagesVues: Number(one(`select count(*) from website_event where ${W} and ${P} and event_type = 1`)),
    pages: table(`select url_path, count(*) from website_event where ${W} and ${P} and event_type = 1 group by 1 order by 2 desc limit 10`),
    sources,
    sourcesIA: sources.filter((s) => MOTEURS_IA.test(s.k)),
    evenements: ev,
    devisParEmplacement: table(`select d.string_value, count(*) from website_event e join event_data d on d.website_event_id = e.event_id where ${WE} and ${PE} and e.event_name = 'devis-clic' and d.data_key = 'emplacement' group by 1 order by 2 desc`),
    prestations: table(`select d.string_value, count(*) from website_event e join event_data d on d.website_event_id = e.event_id where ${WE} and ${PE} and e.event_name = 'prestation-clic' and d.data_key = 'carte' group by 1 order by 2 desc`),
    regions: table(`select concat_ws(' / ', s.country, nullif(s.region,''), nullif(s.city,'')), count(distinct s.session_id) from session s join website_event e on e.session_id = s.session_id where ${WE} and ${PE} group by 1 order by 2 desc limit 12`),
    appareils: table(`select coalesce(s.device,'?'), count(distinct s.session_id) from session s join website_event e on e.session_id = s.session_id where ${WE} and ${PE} group by 1 order by 2 desc`),
    pages404: Number(one(`select count(*) from website_event where ${W} and ${P} and event_type = 1 and page_title like 'Page introuvable%'`)),
    // « Demandes de devis » = formulaire envoyé + clic Appeler + clic E-mail (intentions de contact mesurables).
    demandesDevis: (ev['formulaire-succes'] ?? 0) + (ev['appel-clic'] ?? 0) + (ev['email-clic'] ?? 0),
  };
}

// ───────────────────────── Search Console (optionnel) ─────────────────────────
async function gsc(a, b) {
  if (!env.GSC_KEY_FILE || !existsSync(env.GSC_KEY_FILE)) return null;
  try {
    const key = JSON.parse(readFileSync(env.GSC_KEY_FILE, 'utf8'));
    const t = Math.floor(Date.now() / 1000);
    const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
    const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({ iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: t, exp: t + 3600 })}`;
    const sig = createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url');
    const tok = await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${unsigned}.${sig}` })).json();
    const r = await (await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent('sc-domain:romanmitride.fr')}/searchAnalytics/query`, {
      method: 'POST', headers: { authorization: `Bearer ${tok.access_token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ startDate: jour(a), endDate: jour(addDays(b, -1)), dimensions: ['query'], rowLimit: 25 }) })).json();
    return (r.rows ?? []).map((x) => ({ requete: x.keys[0], clics: x.clicks, impressions: x.impressions, position: Math.round(x.position * 10) / 10 }));
  } catch (e) { return { erreur: String(e).slice(0, 200) }; }
}

// ───────────────────────── contrôle technique ─────────────────────────
function certJours(host) {
  return new Promise((res) => {
    const s = tls.connect(443, host, { servername: host }, () => { const c = s.getPeerCertificate(); s.end(); res(Math.floor((new Date(c.valid_to) - Date.now()) / 864e5)); });
    s.on('error', () => res(-1)); s.setTimeout(10000, () => { s.destroy(); res(-1); });
  });
}
async function statut(url) {
  const t0 = Date.now();
  try { const r = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) }); return { code: r.status, ms: Date.now() - t0, body: r.status === 200 ? await r.text() : '' }; }
  catch (e) { return { code: 0, ms: Date.now() - t0, body: '', err: String(e.cause?.code ?? e.message) }; }
}

export async function controle() {
  const pb = [];
  const sitemap = await statut(`${SITE}/sitemap-0.xml`);
  const pages = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!pages.length) pb.push({ cle: 'sitemap', gravite: 'haute', page: '/sitemap-0.xml', constat: `sitemap illisible (HTTP ${sitemap.code})` });
  const liens = new Set();
  for (const u of [SITE + '/', ...pages, `${SITE}/confidentialite.html`]) {
    const r = await statut(u);
    if (r.code !== 200) pb.push({ cle: `http:${u}`, gravite: u.endsWith('/') || u.includes('confidentialite') ? 'critique' : 'haute', page: u, constat: `${new URL(u).pathname} répond HTTP ${r.code || r.err}` });
    else if (r.ms > 3000) pb.push({ cle: `lent:${u}`, gravite: 'moyenne', page: u, constat: `${new URL(u).pathname} lente (${r.ms} ms)` });
    for (const m of r.body.matchAll(/href="(\/[^"#?]*)"/g)) if (!m[1].startsWith('/_astro')) liens.add(m[1]);
  }
  for (const l of liens) { const r = await statut(SITE + l); if (![200, 301, 308].includes(r.code)) pb.push({ cle: `lien:${l}`, gravite: 'moyenne', page: l, constat: `lien interne cassé (HTTP ${r.code})` }); }
  const stats_ = await statut('https://stats.romanmitride.fr/api/heartbeat');
  if (stats_.code !== 200) pb.push({ cle: 'umami', gravite: 'moyenne', page: 'stats.romanmitride.fr', constat: `statistiques indisponibles (HTTP ${stats_.code})` });
  for (const h of ['romanmitride.fr', 'stats.romanmitride.fr']) {
    const j = await certJours(h);
    if (j < 21) pb.push({ cle: `ssl:${h}`, gravite: j < 7 ? 'critique' : 'haute', page: h, constat: j < 0 ? 'certificat illisible' : `certificat HTTPS expirant dans ${j} jours` });
  }
  // Signaux remontés par Umami sur les dernières 24 h
  const hier = addDays(now(), -1), dem = addDays(now(), 1);
  try {
    const s = stats(hier, dem);
    if ((s.evenements['js-error'] ?? 0) > 0) pb.push({ cle: 'js-error', gravite: 'moyenne', page: '(voir Umami, événement js-error)', constat: `${s.evenements['js-error']} erreur(s) JavaScript en 24 h` });
    if ((s.evenements['formulaire-erreur'] ?? 0) > 0) pb.push({ cle: 'formulaire', gravite: 'haute', page: '/#devis', constat: `${s.evenements['formulaire-erreur']} échec(s) d'envoi du formulaire de devis en 24 h` });
    const moy = Number(sql(`select count(*)/7.0 from website_event where ${W} and ${periode(addDays(now(), -8), addDays(now(), -1))} and page_title like 'Page introuvable%'`)[0][0]);
    if (s.pages404 >= 5 && s.pages404 > 3 * moy) pb.push({ cle: '404', gravite: 'moyenne', page: '(pages introuvables)', constat: `pic de 404 : ${s.pages404} en 24 h (moyenne ${moy.toFixed(1)}/jour)` });
  } catch (e) { pb.push({ cle: 'umami-db', gravite: 'moyenne', page: 'base Umami', constat: `lecture impossible : ${String(e.message).slice(0, 120)}` }); }
  return pb;
}

// Une note par bug, sans doublon ; marquée résolue quand le problème disparaît.
function syncBugs(problemes) {
  const etatP = join(STATE, 'bugs.json');
  const ouverts = existsSync(etatP) ? JSON.parse(readFileSync(etatP, 'utf8')) : {};
  const vus = new Set();
  for (const p of problemes) {
    vus.add(p.cle);
    if (ouverts[p.cle]) continue;
    const fichier = `Bugs/${jour(now())} - ${slug(p.constat)}.md`;
    write(fichier, fm({ date: jour(now()), type: 'bug', statut: 'ouvert', gravite: p.gravite, page: `"${p.page}"`, tags: ['site-analytics', 'bug'] }) +
      `# ${p.constat}\n\n- **Page** : ${p.page}\n- **Gravité** : ${p.gravite}\n- **Constaté le** : ${heure()}\n\n## Reproduction\nOuvrir ${p.page.startsWith('http') || p.page.startsWith('/') ? `\`${p.page}\`` : p.page} (contrôle automatique du Site Analyst).\n\n` +
      `## Piste de correction\n${piste(p.cle)}\n\n## Historique\n- ${heure()} : ouvert\n\n[[_etat-actuel]] · [[Site romanmitride.fr]]\n`);
    ouverts[p.cle] = { fichier, ...p, depuis: heure() };
  }
  for (const [cle, b] of Object.entries(ouverts)) {
    if (vus.has(cle)) continue;
    const c = read(b.fichier);
    if (c) write(b.fichier, c.replace('statut: ouvert', 'statut: résolu') + `- ${heure()} : résolu (le problème n'est plus constaté)\n`);
    delete ouverts[cle];
  }
  writeFileSync(etatP, JSON.stringify(ouverts, null, 2));
  const liste = Object.values(ouverts);
  write('Bugs/_bugs-ouverts.md', fm({ date: jour(now()), type: 'bugs', bugs_ouverts: liste.length, tags: ['site-analytics'] }) +
    `# Bugs ouverts — romanmitride.fr\n\n${liste.length ? liste.map((b) => `- **${b.gravite}** · [[${b.fichier.replace(/^Bugs\//, '').replace(/\.md$/, '')}]] — ${b.constat} (depuis ${b.depuis})`).join('\n') : 'Aucun.'}\n\nMis à jour le ${heure()}. [[_etat-actuel]]\n`);
  return liste;
}
function piste(cle) {
  if (cle.startsWith('http:') || cle === 'sitemap') return 'Vérifier Caddy sur le VPS (`sudo systemctl status caddy`) puis redéployer (`npm run deploy` depuis roman-site).';
  if (cle.startsWith('ssl:')) return 'Caddy renouvelle seul : vérifier `sudo journalctl -u caddy | grep -i acme` et que le DNS pointe toujours vers le VPS.';
  if (cle.startsWith('lien:')) return 'Corriger le lien dans `src/content/site.ts` ou la page concernée, puis redéployer.';
  if (cle === 'umami' || cle === 'umami-db') return 'Sur le VPS : `cd /opt/umami && sudo docker compose ps` puis `sudo docker compose up -d`.';
  if (cle === 'formulaire') return 'Vérifier le compte Formspree (quota, clé) et les clés Turnstile dans `.env`.';
  if (cle === 'js-error') return 'Ouvrir Umami > Événements > js-error pour lire le message et la page, puis corriger le composant.';
  if (cle === '404') return 'Regarder dans Umami les chemins des pages « Page introuvable » : ajouter une redirection si un ancien lien circule.';
  return 'À analyser.';
}

// ───────────────────────── notes ─────────────────────────
const tableMd = (rows, a = 'Élément', b = 'Nombre') => rows.length ? `| ${a} | ${b} |\n|---|---|\n` + rows.map((r) => `| ${r.k} | ${r.v} |`).join('\n') : '_aucune donnée_';
function chiffresMd(s) {
  return `- Visiteurs : **${s.visiteurs}** · visites : ${s.visites} · pages vues : ${s.pagesVues}\n` +
    `- Demandes de devis (formulaire + appels + e-mails) : **${s.demandesDevis}**\n` +
    `- Trafic venant des moteurs IA : ${s.sourcesIA.reduce((n, x) => n + x.v, 0)} visiteur(s)\n\n` +
    `### Pages les plus vues\n${tableMd(s.pages, 'Page')}\n\n### Provenance\n${tableMd(s.sources, 'Source')}\n\n` +
    `### Événements\n${tableMd(Object.entries(s.evenements).map(([k, v]) => ({ k, v })), 'Événement')}\n\n` +
    `### Clics « Demander un devis » par emplacement\n${tableMd(s.devisParEmplacement, 'Emplacement')}\n\n` +
    `### Régions\n${tableMd(s.regions, 'Pays / région / ville')}\n\n### Appareils\n${tableMd(s.appareils, 'Appareil')}\n`;
}

function etatActuel({ aRetenir, alertes, derniers, signaux, lien }) {
  const bugs = Object.values(existsSync(join(STATE, 'bugs.json')) ? JSON.parse(readFileSync(join(STATE, 'bugs.json'), 'utf8')) : {});
  const prec = read('_etat-actuel.md') ?? '';
  const garder = (titre) => (prec.split(`## ${titre}\n`)[1] ?? '').split('\n## ')[0].trim();
  write('_etat-actuel.md', fm({ date: jour(now()), type: 'etat', periode: `${derniers.du}:${derniers.au}`, visiteurs: derniers.visiteurs, demandes_devis: derniers.demandesDevis, bugs_ouverts: bugs.length, tags: ['site-analytics', 'deneb'] }) +
    `# État actuel — romanmitride.fr\n\nPoint d'entrée unique pour [[Deneb]] et les autres agents. Mis à jour le ${heure()} par le Site Analyst.\n\n` +
    `## À retenir\n${aRetenir || garder('À retenir') || '—'}\n\n` +
    `## Alertes\n${[...bugs.filter((b) => ['critique', 'haute'].includes(b.gravite)).map((b) => `- **${b.gravite}** : ${b.constat} (${b.page})`), ...(alertes ?? [])].join('\n') || 'Aucune.'}\n\n` +
    `## Derniers chiffres (7 jours glissants)\n${chiffresMd(derniers).split('\n### ')[0]}\n` +
    `## Signaux de prospection\n${signaux || garder('Signaux de prospection') || '—'}\n\n` +
    `## Liens\n- Bugs ouverts : [[_bugs-ouverts]]\n${lien ? `- Dernier bilan : [[${lien}]]\n` : ''}- Projet : [[Site romanmitride.fr]] · Prospection : [[BMX Flatland Prospector]]\n`);
}

// ───────────────────────── analyse par Claude (abonnement, sans clé API) ─────────────────────────
function claude(prompt) {
  const e = { ...process.env }; delete e.ANTHROPIC_API_KEY;
  const r = spawnSync('claude', ['-p', '--output-format', 'text'], { input: prompt, encoding: 'utf8', env: e, timeout: 15 * 60 * 1000, maxBuffer: 20e6 });
  const out = (r.stdout ?? '').trim();
  if (r.status !== 0 || !out || /usage limit|rate limit|limit reached|quota/i.test(out.slice(0, 300))) throw new Error(`Claude indisponible (code ${r.status}) : ${(r.stderr || out).slice(0, 200)}`);
  return out;
}

async function analyse(a, b, type, fichier) {
  const s = stats(a, b);
  const dureeJ = Math.round((b - a) / 864e5);
  const prev = stats(addDays(a, -dureeJ), a);
  const requetes = await gsc(a, b);
  const donnees = { periode: s, periodePrecedente: { visiteurs: prev.visiteurs, pagesVues: prev.pagesVues, demandesDevis: prev.demandesDevis, sources: prev.sources.slice(0, 5) }, searchConsole: requetes };
  const md = claude(`Tu es le Site Analyst de romanmitride.fr, site vitrine de Roman Mitride, rider professionnel de BMX Flatland (shows, initiations, tournages), basé à Pau et Bordeaux. Objectif du site : générer des demandes de devis.
Voici les statistiques (Umami, sans cookie${requetes ? ', et Google Search Console' : ''}) de la période du ${s.du} au ${s.au}, avec la période précédente pour comparaison :
${JSON.stringify(donnees)}

Écris un compte rendu en français, en Markdown, SANS frontmatter et SANS titre de niveau 1, avec exactement ces sections de niveau 2 :
## Synthèse (4 lignes max)
## Tendances (comparaison chiffrée avec la période précédente)
## Pages et prestations qui convertissent
## D'où vient l'intérêt (régions, sources, dont moteurs IA)
${requetes ? '## Requêtes Google (progression, positions, opportunités)\n' : ''}## Recommandations (3 actions concrètes, par ordre d'impact)
## À retenir (3 lignes maximum, phrases courtes, adaptées à un compte rendu vocal)
## Signaux de prospection (régions/villes où l'intérêt monte, prestations les plus demandées, sites référents d'organisateurs, mairies ou festivals)
Règles : n'invente aucun chiffre ; si les données sont trop faibles pour conclure, dis-le simplement.`);
  const section = (t) => (md.split(`## ${t}`)[1] ?? '').split('\n## ')[0].replace(/^[^\n]*\n/, '').trim();
  write(fichier, fm({ date: jour(now()), type, periode: `${s.du}:${s.au}`, visiteurs: s.visiteurs, demandes_devis: s.demandesDevis, bugs_ouverts: Object.keys(JSON.parse(readFileSync(join(STATE, 'bugs.json'), 'utf8') || '{}')).length, tags: ['site-analytics', type] }) +
    `# ${type === 'mensuel' ? 'Bilan mensuel' : type === 'bimensuel' ? 'Bilan de quinzaine' : 'Analyse'} — ${s.du} au ${s.au}\n\n${md}\n\n## Chiffres détaillés\n${chiffresMd(s)}\n\n[[_etat-actuel]] · [[Site romanmitride.fr]]\n`);
  etatActuel({ aRetenir: section('À retenir'), signaux: section('Signaux de prospection'), derniers: stats(addDays(now(), -7), addDays(now(), 1)), lien: fichier.replace(/\.md$/, '') });
  return fichier;
}

// ───────────────────────── commandes ─────────────────────────
const [cmd, ...args] = process.argv.slice(2);
const opt = (n) => args.find((x) => x.startsWith(`--${n}=`))?.split('=')[1];
try {
  if (!existsSync(join(STATE, 'bugs.json'))) writeFileSync(join(STATE, 'bugs.json'), '{}');
  if (cmd === 'check') {
    const pb = await controle();
    const ouverts = syncBugs(pb);
    if (pb.length || ouverts.length || !read('_etat-actuel.md')) etatActuel({ derniers: stats(addDays(now(), -7), addDays(now(), 1)) });
    log(`contrôle : ${pb.length} problème(s)`);
  } else if (cmd === 'quotidien') {
    const d = addDays(now(), -1), s = stats(d, now());
    write(`Quotidien/${jour(d)}.md`, fm({ date: jour(d), type: 'quotidien', periode: `${jour(d)}:${jour(d)}`, visiteurs: s.visiteurs, demandes_devis: s.demandesDevis, bugs_ouverts: Object.keys(JSON.parse(readFileSync(join(STATE, 'bugs.json'), 'utf8'))).length, tags: ['site-analytics', 'quotidien'] }) +
      `# Chiffres du ${jour(d)}\n\n${chiffresMd(s)}\n[[_etat-actuel]]\n`);
    etatActuel({ derniers: stats(addDays(now(), -7), addDays(now(), 1)) });
    log(`quotidien ${jour(d)} : ${s.visiteurs} visiteur(s)`);
  } else if (cmd === 'bilan') {
    const d = now(), fait = join(STATE, `bilan-${jour(d)}`);
    if (existsSync(fait) && !args.includes('--force')) { log('bilan déjà fait aujourd’hui'); process.exit(0); }
    if (d.getDate() !== 1 && d.getDate() !== 15 && !args.includes('--force')) { log('pas de bilan aujourd’hui'); process.exit(0); }
    const fin = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const debutQ = d.getDate() === 1 ? new Date(d.getFullYear(), d.getMonth() - 1, 15) : new Date(d.getFullYear(), d.getMonth(), 1);
    const q = debutQ.getDate() === 1 ? 'Q1' : 'Q2';
    await analyse(debutQ, fin, 'bimensuel', `Bimensuel/${debutQ.getFullYear()}-${pad(debutQ.getMonth() + 1)}-${q}.md`);
    if (d.getDate() === 1) { const m = new Date(d.getFullYear(), d.getMonth() - 1, 1); await analyse(m, fin, 'mensuel', `Mensuel/${m.getFullYear()}-${pad(m.getMonth() + 1)}.md`); }
    writeFileSync(fait, heure()); log('bilan écrit');
  } else if (cmd === 'demandes' || cmd === 'run') {
    const todo = cmd === 'run' ? [{ periode: opt('periode'), type: opt('type') ?? 'analyse' }] :
      readdirSync(join(OUT, '_demandes')).filter((f) => f.endsWith('.md')).map((f) => ({ f, c: read(`_demandes/${f}`) }))
        .filter((x) => /statut:\s*nouvelle/i.test(x.c)).map((x) => ({ ...x, periode: x.c.match(/periode:\s*(\S+)/)?.[1], type: x.c.match(/type:\s*(\S+)/)?.[1] ?? 'analyse' }));
    for (const t of todo) {
      const [p1, p2] = (t.periode ?? '').split(':');
      const a = p1 ? new Date(`${p1}T00:00`) : addDays(now(), -30), b = p2 ? addDays(new Date(`${p2}T00:00`), 1) : now();
      const fichier = await analyse(a, b, 'analyse', `Analyses/${jour(now())} - ${jour(a)} au ${jour(addDays(b, -1))}.md`);
      if (t.f) write(`_demandes/${t.f}`, t.c.replace(/statut:\s*nouvelle/i, 'statut: traitée') + `\n\nTraitée le ${heure()} : [[${fichier.replace(/\.md$/, '')}]]\n`);
      log(`analyse écrite : ${fichier}`);
    }
  } else {
    console.log('Commandes : check | quotidien | bilan [--force] | demandes | run --periode=AAAA-MM-JJ:AAAA-MM-JJ'); process.exit(1);
  }
} catch (e) {
  log(`ÉCHEC : ${e.message}`);
  try { etatActuel({ alertes: [`- Le Site Analyst a échoué (${cmd}) le ${heure()} : ${String(e.message).slice(0, 160)}`], derniers: stats(addDays(now(), -7), addDays(now(), 1)) }); } catch { /* base indisponible */ }
  process.exit(2);
}
