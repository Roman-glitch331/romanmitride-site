# Projet site — romanmitride.fr

Site vitrine de Roman Mitride (rider BMX Flatland). Un seul but : obtenir des demandes de devis d'organisateurs
(mairies, festivals, salons, entreprises, écoles). Astro + React + Tailwind, 100 % statique.

## Règles
1. **Jamais de modification en production sans validation de Roman**, texte par texte. On propose, il valide, on intègre mot pour mot.
2. Aucun fait, chiffre, prix, référence ni témoignage inventé : écrire « à confirmer par Roman ».
3. Ne supprime rien : archive dans `_archive/`.
4. Aucune manip qui exige un redémarrage de session. Pas de dépendance au mod sessions-liees.
5. Réponses courtes, mots simples, vouvoiement dans les textes du site.

## Chemins
- Dépôt : ce dossier. Référence = remote `origin` (VPS) ; `github` = copie publique Roman-glitch331/romanmitride-site
- Vault Obsidian et VPS : accessibles seulement depuis le Mac, pas depuis le cloud
- Contenu : `src/content/site.ts` (presque tout), pages longues dans `src/pages/{show,initiation,tournage}-bmx.astro`
- Couleurs : `src/styles/global.css` (`@theme`). Photos : `src/assets/photos/`. Vidéos : `scripts/media.sh`
- Site Analyst (code) : `site-analyst/` ; copie en service : VPS `/opt/site-analyst`
- Vault : `~/Documents/Obsidian/vault` → `Site-Analytics/` (rapports), `Agents/Rédacteur`, `Agents/Développeur/Missions`
- Détails de lecture à la demande : `references/` (charte, SEO, dépendances, retour arrière)

## Déploiement (jamais sans validation)
`npm run build && python3 scripts/deploy.py prod`
Clé `~/.ssh/bmx_vps_ed25519`, compte ubuntu, VPS 141.227.131.195, releases `/var/www/romanmitride/releases`, lien `current`.
Le déploiement VPS est confié à Deneb Système (voir `references/dependances.md`). Retour arrière : `references/retour-arriere.md`.

## À ne pas toucher
- BMX Prospector, ses files, le verrou d'abonnement, la boîte contact@romanmitride.fr.
- `/confidentialite-evenementiel.html` : URL figée pour l'app OAuth Google de Prospector événementiel.
- Clé SSH, `.env` (Formspree, Turnstile, Umami), `deploy/Caddyfile.tmpl` sans accord.
- Les agents partagés du VPS (Sentinelle, Réparateur, Auditeur, équipe Développeur) : ils servent aussi Deneb.

## Planifié sans moi (VPS, compte ubuntu)
Site Analyst : `check` 3h30, `quotidien` 3h35, `bilan` le 1er et le 15, `demandes` toutes les 15 min, `seo` lundi 4h15.
Sentinelle (sonde 5 min) surveille le serveur. Rien à relancer à la main.

## Skills (`.claude/skills/`)
`audit-seo`, `correctif-site`, `prestations`, `verifier-site`, `devis`. Chacun dit quoi lire et où s'arrêter.

## Mémoire de travail
Au démarrage et après compactage : lire seulement `Site-Analytics/_etat-actuel.md` (extrait « À retenir ») et le dernier
compte rendu `Contexte-Claude/Site/` (voir index `wiki/projects/Site romanmitride.fr.md`).
Après chaque travail : un compte rendu court « fait / à faire ».
