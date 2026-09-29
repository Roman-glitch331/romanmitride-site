# Site Analyst — romanmitride.fr

Agent qui surveille le site et écrit ses comptes rendus dans le vault Obsidian, dossier `Site-Analytics/`.
Il **ne communique jamais directement avec Deneb** : Obsidian est le seul canal d'échange.

## Où il tourne
- VPS OVH, dans `/opt/site-analyst/`, sous l'utilisateur **`ubuntu`**, qui est connecté à l'**abonnement Claude Pro**
  (Claude Code en mode headless). La variable `ANTHROPIC_API_KEY` est retirée avant chaque appel : **aucune clé API**.
- Accès en écriture limité au seul dossier `vault/Site-Analytics/` (ACL), accès en **lecture seule** à la base Umami
  (rôle Postgres `analyst`, sur `127.0.0.1:5433`).
- Les tâches qui utilisent Claude attendent le verrou de BMX Prospector (`site-analyst-verrou`) : elles ne tournent
  **jamais en parallèle** de la veille.

## Planning (crontab de `ubuntu`, heure de Paris)
| Quand | Commande | Claude ? |
|---|---|---|
| Tous les jours, 3 h 30 | `site-analyst check` : contrôle technique, écrit seulement en cas de problème | non |
| Tous les jours, 3 h 35 | `site-analyst quotidien` : chiffres bruts de la veille | non |
| Le 1er et le 15, 4 h 30 (réessai à 5 h 30, 6 h 30 et 7 h 30) | `site-analyst-verrou bilan` : quinzaine, et mois le 1er | oui |
| Toutes les 15 min | `site-analyst-verrou demandes`, seulement s'il y a une demande nouvelle | oui |

Si Claude est indisponible (limite de l'abonnement), l'échec est signalé dans la section « Alertes » de
`_etat-actuel.md`, et le bilan est retenté l'heure suivante.

## Ce qu'il écrit dans le vault (`Site-Analytics/`)
- `_etat-actuel.md` : **point d'entrée unique** pour Deneb. Il contient les sections « À retenir » (3 lignes max,
  pour un compte rendu vocal), « Alertes », « Derniers chiffres », « Signaux de prospection » (pour BMX Prospector).
- `Quotidien/AAAA-MM-JJ.md` : chiffres bruts du jour.
- `Bimensuel/AAAA-MM-Q1.md` (du 1er au 14) et `AAAA-MM-Q2.md` (du 15 à la fin du mois), `Mensuel/AAAA-MM.md`.
- `Analyses/…` : les analyses faites à la demande.
- `Bugs/AAAA-MM-JJ - titre.md` : une note par bug (gravité, page, constat, reproduction, piste de correction), sans
  doublon, marquée `statut: résolu` quand le problème disparaît. La liste à jour est dans `Bugs/_bugs-ouverts.md`.

Chaque note porte le même frontmatter : `date`, `type`, `periode`, `visiteurs`, `demandes_devis`, `bugs_ouverts`, `tags`.
« Demandes de devis » = formulaire envoyé + clics « Appeler » + clics « E-mail ».

## Contrôle technique
- Codes HTTP et temps de réponse de toutes les pages du sitemap, plus `/confidentialite.html`.
- Liens internes cassés.
- Certificats HTTPS (alerte à 21 jours de l'expiration).
- Disponibilité d'Umami.
- Dans Umami : erreurs JavaScript (`js-error`), échecs du formulaire, pics de pages introuvables.

La régression Lighthouse et les erreurs d'indexation Search Console restent à ajouter.

## Demande d'analyse par Deneb
Créer une note `Site-Analytics/_demandes/AAAA-MM-JJ-HHmm.md` :

```markdown
---
statut: nouvelle
type: analyse
periode: 2026-10-01:2026-10-31
---
Analyse demandée par Deneb (facultatif : précisions).
```

Dans les 15 minutes, l'agent écrit l'analyse dans `Analyses/`, passe la note en `statut: traitée` et y ajoute le lien.

Lancement manuel : `site-analyst run --periode=2026-10-01:2026-10-31`.

## Google Search Console (optionnel, à activer)
1. Dans Google Cloud, créer un **compte de service** et télécharger sa clé JSON.
2. Dans Search Console → Paramètres → Utilisateurs et autorisations, l'ajouter comme utilisateur (niveau « Complet »).
3. Copier la clé dans `/opt/site-analyst/gsc-service-account.json` (droits 600), puis décommenter `GSC_KEY_FILE` dans `.env`.

Les requêtes Google, les positions, les clics et les impressions apparaîtront alors dans les bilans.

## Tester
- `site-analyst check`
- `SITE=https://romanmitride.fr/panne-simulee site-analyst check` : simule une panne. Les bugs sont créés, puis
  résolus au contrôle normal suivant.
