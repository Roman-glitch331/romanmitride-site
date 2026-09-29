# Rapport d'audit — romanmitride.fr

*Mis en ligne le 29 septembre 2026. Mesures du 29/09/2026, faites en production sur le VPS OVH.*

## Checklist de lancement (section 8 du cahier des charges)

| # | Point | État | Preuve |
|---|---|---|---|
| 1 | Mentions légales (LCEN) | ✅ | `/mentions-legales` : BMX Flatland Pau, siège au 372 av. Thiers à Bordeaux, SIRET, directeur de publication, hébergeur OVH |
| 2 | Politique de confidentialité RGPD | ⚠️ | `/confidentialite.html` : sections Deneb/Prospector intactes, plus une section « Visiteurs ». Elle décrit Formspree et Turnstile, **pas encore actifs** : à relire à l'activation du formulaire |
| 3 | Pas de CGU/CGV | ✅ | Aucune vente en ligne |
| 4 | Bannière cookies seulement si plan B Instagram | ✅ | Plan A appliqué (vidéos hébergées sur le site) : aucun traceur, aucune bannière |
| 5 | Aucun secret exposé | ✅ | `.env` ignoré par git. Seules des clés publiques côté client. Secrets serveur en droits 600 |
| 6 | HTTPS forcé + www → apex | ✅ | http → 308, www → 301 vers `https://romanmitride.fr` |
| 7 | En-têtes de sécurité | ✅ | HSTS 1 an, CSP stricte par empreintes SHA-256 (sans `unsafe-inline`), nosniff, Referrer-Policy, Permissions-Policy, `frame-ancestors 'none'` et X-Frame-Options |
| 8 | `npm audit` | ✅ | 0 vulnérabilité |
| 9 | `<title>` et descriptions uniques | ✅ | 8 pages, chacune la sienne |
| 10 | Image Open Graph 1200×630 | ✅ | Une image générique, plus une par page prestation et une pour la FAQ |
| 11 | Favicon complet | ✅ | SVG, ICO, apple-touch-icon, manifest |
| 12 | `sitemap.xml` + `robots.txt` | ✅ | `sitemap-index.xml` (7 URL). `robots.txt` ouvre l'accès aux robots des moteurs et des IA |
| 13 | JSON-LD, URL canoniques | ✅ | Person, Service ×3, FAQPage, BreadcrumbList, WebSite : 8 blocs valides. Canonical sur chaque page. VideoObject non fait (voir « Reste à faire ») |
| 14 | Polices hébergées sur le site | ✅ | Fraunces et Inter (Fontsource), aucun appel à Google Fonts |
| 15 | Images AVIF/WebP, vidéos compressées avec poster | ✅ | Images générées par Astro. Clips de 1,4 à 3,4 Mo en 720p H.264. Posters chargés en différé |
| 16 | Lighthouse mobile ≥ 90, LCP < 2,5 s, CLS < 0,1 | ✅ | 97 à 100 en performance et 100 ailleurs sur toutes les pages mesurées. LCP de 1,4 à 2,3 s, CLS ≤ 0,078 |
| 17 | Chargement différé de ce qui est hors écran | ✅ | Vidéos, posters et galerie chargés à l'approche |
| 18 | Texte alternatif descriptif | ✅ | Chaque image décrit la figure et le lieu (centralisé dans `site.ts`) |
| 19 | WCAG AA, clavier, focus, `lang="fr"` | ✅ | Contrastes 7,2 à 15,2:1, focus visible, visionneuse utilisable au clavier, lien d'évitement |
| 20 | Responsive 360 / 390 / 768 / 1024 / 1440 px | ✅ | Aucun débordement horizontal sur les 8 pages aux 5 largeurs |
| 21 | Page 404 utile | ✅ | Photo BMX, liens vers l'accueil, les prestations et le devis, vrai code 404 |
| 22 | Aucun lien cassé | ✅ | Vérification automatique chaque nuit par le Site Analyst |
| 23 | Umami sans cookie avec plan de suivi | ✅ | `stats.romanmitride.fr`. Événements : navigation, cartes, devis par emplacement, appel, e-mail, formulaire, reels, vidéos, scroll, js-error. Provenance tronquée au domaine, purge après 25 mois |
| 24 | Un seul CTA principal | ✅ | « Demander un devis » (menu, hero, prestations, pages, 404) |

## Lighthouse mobile (performance / accessibilité / bonnes pratiques / SEO)

| Page | Scores | LCP | CLS | Poids |
|---|---|---|---|---|
| Accueil | 99-100 / 100 / 100 / 100 | 1,4-2,0 s | 0 | 222 Ko |
| Show BMX | 99 / 100 / 100 / 100 | 2,0 s | 0,005 | 226 Ko |
| Initiation BMX | 99 / 100 / 100 / 100 | 2,0 s | 0,036 | 188 Ko |
| Tournages & images | 97 / 100 / 100 / 100 | 2,3 s | 0,078 | 288 Ko |
| FAQ | 100 / 100 / 100 / 100 | 1,7 s | 0 | 110 Ko |

## Choix appliqués
- **Instagram :** plan A. Les 3 reels sont hébergés sur le site avec la bande-son des publications. Le 3e est le montage Instagram lui-même, car la vidéo brute fournie ne correspondait à aucun post.
- **3D :** aucune, les vidéos réelles suffisent. La décision de désactiver la 3D sur mobile ne s'est donc pas posée.
- **Hébergement :** VPS OVH existant, avec Caddy. GitHub Pages est abandonné, car il ne permet pas les en-têtes de sécurité.

## TODO à compléter par Roman
- 2 ou 3 phrases de parcours dans la section À propos.
- Crédits : photo de show avec le public, et photos casquette noire (portrait, tailwhip).
- Vidéos Initiation et Tournage plus représentatives. Original HD de la photo du hero.
- Durée type d'une initiation, âge minimum, équipements de sécurité fournis.
- Activer le formulaire (Formspree + Turnstile), puis relire la section « Visiteurs » de la confidentialité.
