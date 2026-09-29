# Rapport SEO — romanmitride.fr

*État au 29 septembre 2026. SERP observées le 25/09 depuis la région de Pau, sans outil de volume de recherche : classement qualitatif.*

## Mots-clés par page

| Page | Requête principale | Requêtes secondaires |
|---|---|---|
| `/` | rider BMX flatland professionnel | Roman Mitride, BMX flatland Pau, rider BMX Bordeaux |
| `/show-bmx` | show BMX flatland | démonstration BMX flatland, spectacle BMX, animation BMX événement / entreprise / festival / mairie |
| `/initiation-bmx` | initiation BMX flatland | animation BMX collectivité, initiation BMX enfants |
| `/tournage-bmx` | tournage BMX | rider BMX publicité, clip BMX (jamais « cascadeur ») |
| `/faq` | tarif show BMX | qu'est-ce que le BMX flatland, surface nécessaire pour un show |

**Gains rapides :** sur « show bmx pau », « bmx flatland pau » et « animation bmx pyrénées-atlantiques », aucun prestataire de show n'apparaît dans les 5 premiers résultats.
**Hors de portée à court terme :** « show bmx », « spectacle bmx », « prestation bmx », dominés par des agences.

## Données structurées
8 blocs JSON-LD valides (vérifiés à la compilation) : Person (avec `sameAs` Instagram et TikTok), Service ×3, FAQPage, BreadcrumbList ×3, WebSite.
Le **Rich Results Test** de Google reste à passer (outil en ligne) : https://search.google.com/test/rich-results?url=https%3A%2F%2Fromanmitride.fr%2Fshow-bmx
Le balisage FAQPage n'affiche plus d'extrait enrichi pour ce type de site depuis 2023, mais il reste utile pour les IA.

## GEO (référencement par les moteurs IA)
- Tout le contenu est en HTML statique, lisible sans JavaScript.
- Une phrase factuelle identique partout : site, `llms.txt`, JSON-LD et profil de BMX Prospector.
- `robots.txt` ouvre l'accès à GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended et Bingbot.
- Palmarès sourcé : 17e de la Coupe du monde UCI au FISE Montpellier 2025 (UCI), 6e aux Championnats de France 2023 (fatbmx).

## Déjà fait hors site
- Google Search Console : propriété Domaine validée, sitemap soumis.
- Bing Webmaster Tools, importé depuis Search Console. Bing alimente ChatGPT et Copilot.

## Plan d'actions hors site, par priorité
1. **Fiche Google Business Profile** en établissement de services, zones Pau, Bordeaux et Nouvelle-Aquitaine, sans adresse publique. C'est le plus fort levier local.
2. **Mettre le lien du site partout :** bio Instagram et TikTok (avec `?utm_source=instagram` et `?utm_source=tiktok` pour mesurer l'effet), profil FISE (à corriger : Amateur → Pro, ville), annuaires.
3. **Annuaires d'événementiel :** Acteur Fête (la fiche « BDXBMX » ne te concerne pas), Le Mag de l'Événementiel, Annuaire du spectacle, PagesJaunes. Pour les tournages : Film France Talents, Commission du film 64.
4. **Liens entrants réalistes :**
   - interview sur fatbmx.com, Flat Matters ;
   - lien depuis la chaîne ou le site de Kevin Meyer (tuto « feat. Roman Mitride ») ;
   - comités FFC ;
   - agendas des communes après chaque show ;
   - presse et radios locales (Sud Ouest, La République des Pyrénées).
5. **Bande démo sur YouTube,** avec un lien vers le site : Google affiche un carrousel vidéo sur presque toutes les recherches « show BMX ».
6. **Page « Réalisations » :** une note par show (ville et type d'événement dans le titre), à partir des vrais événements. C'est le levier de longue traîne locale. Pas de pages par ville sans contenu réel : Google les pénalise.

## Suivi
Le Site Analyst écrit un bilan le 1er et le 15 de chaque mois dans `Site-Analytics/`. Il inclura les requêtes Google dès qu'un compte de service Search Console sera branché (voir `site-analyst/README.md`).
