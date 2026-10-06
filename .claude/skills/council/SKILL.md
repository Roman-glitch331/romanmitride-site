---
name: council
description: LLM Council. Soumet une question à 5 conseillers indépendants (Council of Five), les fait se critiquer et se classer en anonyme, puis produit une synthèse finale. À lancer uniquement via /council.
disable-model-invocation: true
argument-hint: <question ou décision à soumettre au council>
---

# Council

Question soumise : $ARGUMENTS

Si la question est vide, demande-la à l'utilisateur et arrête-toi là.

## Étape 1 — Premiers avis (parallèle)

Lance **5 sous-agents en un seul message** (outil Agent, `subagent_type: general-purpose`, `run_in_background: false`). Chacun reçoit la question et le contexte nécessaire, mais **pas** les réponses des autres. Ne valide pas l'idée par défaut : chaque conseiller juge, il ne flatte pas. Angles :

1. **Contrarian** : qu'est-ce qui pourrait mal tourner ? Risques, failles, cas limites.
2. **First Principles** : résout-on le bon problème ? Reformule depuis les bases.
3. **Expansionist** : quel potentiel a-t-on manqué ? Opportunités et leviers sous-exploités.
4. **Outsider** : regard neuf, zéro biais, sans le jargon ni les présupposés du domaine.
5. **Executor** : quelle est la prochaine action concrète, et comment la réaliser ?

Demande des réponses concises (≤ 300 mots) avec une position claire.

## Étape 2 — Revue anonyme (parallèle)

Anonymise les 5 réponses (Réponse A à E, ordre mélangé, sans l'angle d'origine). Lance **5 nouveaux sous-agents en parallèle**, chacun recevant la question et les 5 réponses anonymes. Chacun doit :
- critiquer brièvement chaque réponse (forces, erreurs) ;
- les classer de la meilleure à la moins bonne, sur l'exactitude et la pertinence ;
- terminer par une ligne `CLASSEMENT: X > Y > Z > W > V`.

## Étape 3 — Synthèse du chairman

Agrège les classements (rang moyen par réponse). Puis, toi-même en tant que chairman, produis la réponse finale à partir des réponses, du classement et des critiques : retiens les meilleurs éléments, tranche les désaccords, signale les risques restants.

## Format de sortie (français, bref)

1. **Verdict** : décision claire.
2. **Prochaine étape** : une action concrète à faire maintenant.
3. **Consensus / désaccords** : 2 à 4 puces.
4. **Classement** : tableau rang moyen par réponse (avec l'angle révélé).

Ne reproduis pas les réponses complètes sauf si l'utilisateur le demande.
