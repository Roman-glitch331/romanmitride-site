#!/bin/bash
# Exécute le Site Analyst en attendant la fin d'un cycle de BMX Prospector (même verrou, ouvert en lecture :
# /tmp protège les fichiers d'un autre utilisateur contre l'ouverture en création).
L=/tmp/bmx-prospector.lock
if [ -e "$L" ]; then exec 9<"$L"; flock -w "${ATTENTE:-3600}" 9 || { echo "verrou toujours pris après ${ATTENTE:-3600} s"; exit 3; }; fi
exec /usr/local/bin/site-analyst "$@"
