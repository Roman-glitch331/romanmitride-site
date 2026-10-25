---
name: verifier-site
description: "Vérifier que romanmitride.fr fonctionne : réponse, pages, formulaire de devis, certificat, alertes du Site Analyst. Lecture seule."
---

1. `curl -s -o /dev/null -w '%{http_code} %{time_total}s' https://romanmitride.fr/` puis les pages du sitemap.
2. Lire `Site-Analytics/_etat-actuel.md` (Alertes, À retenir) et `Site-Analytics/Bugs/_bugs-ouverts.md`.
3. Formulaire : vérifier que `PUBLIC_FORMSPREE_ID` et `PUBLIC_TURNSTILE_SITEKEY` sont présents au build, sans envoyer de demande réelle.
4. Rendre : OK / à corriger, 5 lignes max. Ne rien modifier.
