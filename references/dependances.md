# Dépendances à ne pas casser
- Formulaire de devis : Formspree + Cloudflare Turnstile (clés publiques dans `.env`).
- Hébergement : VPS 141.227.131.195 (Caddy), pas OVH. Clé ~/.ssh/bmx_vps_ed25519 partagée avec Prospector.
- Mise en ligne : confiée à Deneb Système (« déploie le site » dans son chat). Les gros envois depuis le Mac ont calé le 17/10.
- Vitrine Instagram : reels hébergés, déclarés dans `site.ts` (`reels`).
- Prospector : verrou d'abonnement commun, vault synchronisé, URL figée /confidentialite-evenementiel.html.
