# romanmitride.fr

Site vitrine de Roman Mitride, rider professionnel de BMX Flatland. Astro + React + Tailwind, site 100 % statique.

## Modifier le site : où changer quoi

**Presque tout se modifie dans un seul fichier : [`src/content/site.ts`](src/content/site.ts).**

| Je veux changer… | Où |
|---|---|
| Téléphone, e-mail, réseaux, villes | `identite` |
| Palmarès (avec la source !) | `palmares` |
| Phrase de présentation reprise partout | `phraseCitable` |
| Explication du Flatland | `flatlandEnDeuxPhrases` |
| Prix « à partir de », mention sur les devis | `tarifs` |
| Surface nécessaire | `technique` |
| Titre de la section À propos | `aPropos` |
| Les 4 cartes prestations (texte, vidéo) | `cartes` |
| Section « Pour qui ? » | `publics` |
| Questions de la FAQ | `faq` |
| Vidéos Instagram et lien vers chaque post | `reels` |
| Mentions légales (siège, SIRET…) | `editeur`, `hebergeur` |
| Photo du hero, portrait, photos et vidéos des pages, galerie | `medias` |
| Photographes | `credits` |

Les **textes longs des pages prestations** sont dans `src/pages/show-bmx.astro`, `initiation-bmx.astro` et
`tournage-bmx.astro` : modifier le texte entre les balises `<p>…</p>`, sans toucher au reste.

Les **couleurs** sont en haut de `src/styles/global.css` (bloc `@theme`).

## Ajouter ou remplacer une photo
1. Déposer la photo dans `src/assets/photos/` avec un nom descriptif (ex. `show-bmx-mairie-pau.jpg`).
2. Indiquer ce nom dans `medias` (dans `site.ts`), avec un texte alternatif qui décrit la figure et le lieu.
Astro la convertit automatiquement en AVIF/WebP aux bonnes tailles.

## Ajouter ou remplacer une vidéo
1. Déposer la vidéo brute dans `media-source/videos/` (ce dossier n'est pas envoyé sur GitHub).
2. L'ajouter à la liste `LIST` de `scripts/media.sh`, puis lancer `bash scripts/media.sh` (ffmpeg requis).
3. Utiliser son nom (sans extension) dans `site.ts`.

## Lancer le site en local
```bash
npm install
npm run dev
```
Puis ouvrir http://localhost:4321. `npm run build` produit le site final dans `dist/`.

## Services externes (clés publiques dans `.env`, voir `.env.example`)
- Formulaire : Formspree (`PUBLIC_FORMSPREE_ID`) + Cloudflare Turnstile (`PUBLIC_TURNSTILE_SITEKEY`).
- Statistiques sans cookie : Umami auto-hébergé (`PUBLIC_UMAMI_SRC`, `PUBLIC_UMAMI_ID`).
Sans ces clés, le site fonctionne : le formulaire renvoie simplement vers le téléphone et l'e-mail.

## À ne pas casser
`/confidentialite.html` est l'URL déclarée dans l'application Google de Deneb et BMX Flatland Prospector :
ne pas la renommer, et ne modifier ses sections 1 à 3 que si le comportement de ces outils change.

## Déploiement
Sur le VPS OVH, servi par Caddy (procédure à venir dans ce README).
