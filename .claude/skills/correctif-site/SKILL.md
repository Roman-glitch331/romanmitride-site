---
name: correctif-site
description: "Corriger un bug ou appliquer un changement validé sur romanmitride.fr (code de ce dépôt). Seulement après validation de Roman."
---

1. Confirmer ce que Roman a validé (texte exact, page). Sans validation : s'arrêter.
2. Travailler dans la racine du dépôt sur une branche, jamais en prod. Contenu : `src/content/site.ts`.
3. `npm run build`, vérifier à ~1100 px et 390 px, cibles tactiles ≥ 44 px.
4. Montrer le diff à Roman. Ne pas déployer : la mise en ligne passe par Deneb Système (`references/dependances.md`).
5. Écrire un compte rendu court dans le vault.
