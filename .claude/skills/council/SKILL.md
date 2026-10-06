---
name: council
description: LLM Council. Soumet une question à plusieurs sous-agents indépendants, les fait se critiquer et se classer en anonyme, puis produit une synthèse finale. À lancer uniquement via /council.
disable-model-invocation: true
argument-hint: <question ou décision à soumettre au council>
---

# Council

Question soumise : $ARGUMENTS

Si la question est vide, demande-la à l'utilisateur et arrête-toi là.

## Étape 1 — Premiers avis (parallèle)

Lance **4 sous-agents en un seul message** (outil Agent, `subagent_type: general-purpose`, `run_in_background: false`). Chacun reçoit la question et le contexte nécessaire, mais **pas** les réponses des autres. Donne à chacun un angle distinct :

1. Pragmatique : la solution la plus simple qui marche.
2. Sceptique : risques, failles, cas limites, ce qui peut mal tourner.
3. Expert technique : exactitude, détails, bonnes pratiques.
4. Alternatif : approche non évidente ou remise en cause de la question.

Demande des réponses concises (≤ 300 mots) avec une recommandation claire.

## Étape 2 — Revue anonyme (parallèle)

Anonymise les 4 réponses (Réponse A, B, C, D, ordre mélangé, sans l'angle d'origine). Lance **4 nouveaux sous-agents en parallèle**, chacun recevant la question et les 4 réponses anonymes. Chacun doit :
- critiquer brièvement chaque réponse (forces, erreurs) ;
- les classer de la meilleure à la moins bonne, sur l'exactitude et la pertinence ;
- terminer par une ligne `CLASSEMENT: X > Y > Z > W`.

## Étape 3 — Synthèse du chairman

Agrège les classements (rang moyen par réponse). Puis, toi-même en tant que chairman, produis la réponse finale à partir des réponses, du classement et des critiques : retiens les meilleurs éléments, tranche les désaccords, signale les risques restants.

## Format de sortie (français, bref)

1. **Réponse finale** : recommandation claire.
2. **Consensus / désaccords** : 2 à 4 puces.
3. **Classement** : tableau rang moyen par réponse (avec l'angle révélé).

Ne reproduis pas les réponses complètes sauf si l'utilisateur le demande.
