# Retour arrière
**Site** : 5 releases sous `/var/www/romanmitride/releases` (dernière au 25/10 : 20261020-135028). Revenir à une précédente :
`sudo ln -sfn /var/www/romanmitride/releases/<release> /var/www/romanmitride/current && sudo systemctl reload caddy`
**Migration** : tout est ajouté (dossier `04_Site/` : CLAUDE.md, .claude/skills, references, _archive). Pour annuler, supprimer ces éléments à la main ; rien d'autre n'a été modifié.
Les agents du registre vault n'ont pas été désactivés (copie seulement dans `_archive/`).
