#!/usr/bin/env bash
# Compresse media-source/ en versions web : public/media/*.mp4|webm (720p) + src/assets/posters/*.jpg
# Usage : bash scripts/media.sh   (ffmpeg requis)
set -euo pipefail
cd "$(dirname "$0")/.."
S=media-source; O=public/media; P=src/assets/posters
mkdir -p "$O" "$P"
# nom-web | source | durée max (s) | son (0/1)
LIST="
hero-bmx-flatland-coucher-de-soleil|$S/videos/VXCF2416.MOV|12|0
show-bmx-flatland-public|$S/videos/IMG_3850.MOV|12|0
initiation-bmx-gymnase|$S/videos/TNLH8162.MOV|12|0
demonstration-bmx-flatland-contest|$S/videos/VABG0127.MP4|12|0
bmx-flatland-halle-vitree|$S/videos/2a82f01bd6b449f1aec2bac83a83a998.mov|12|0
bmx-flatland-esplanade|$S/videos/trim.7C444F13-AF51-4820-8139-553D33D99D39_VCZ_2025-10-21_19-20-43_055.mov|12|0
"
echo "$LIST" | while IFS='|' read -r name src max snd; do
  [ -z "$name" ] && continue
  VF="scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)',fps=30"
  if [ "$snd" = 1 ]; then A=(-c:a aac -b:a 96k); AW=(-c:a libopus -b:a 80k); else A=(-an); AW=(-an); fi
  ffmpeg -nostdin -v error -y -i "$src" -t "$max" -vf "$VF" -c:v libx264 -preset slow -crf 28 -profile:v high -pix_fmt yuv420p -movflags +faststart "${A[@]}" "$O/$name.mp4"
  ffmpeg -nostdin -v error -y -i "$src" -t "$max" -vf "$VF" -c:v libvpx-vp9 -crf 40 -b:v 0 -row-mt 1 -deadline good -cpu-used 4 "${AW[@]}" "$O/$name.webm"
  ffmpeg -nostdin -v error -y -ss 1 -i "$src" -frames:v 1 -vf "$VF" -q:v 3 "$P/$name.jpg"
  printf '%-40s mp4 %6s  webm %6s\n' "$name" "$(du -h "$O/$name.mp4" | cut -f1)" "$(du -h "$O/$name.webm" | cut -f1)"
done

# Vitrine Instagram : image brute + bande-son de la publication Instagram (téléchargée avec yt-dlp dans media-source/insta/).
# nom | vidéo | audio | décalage audio (s, calé par corrélation d'images) — reel 3 : montage Instagram complet.
REELS="
reel-roman-mitride-1|$S/insta/reel-1.mov|$S/insta/ig-DWW8KA3jKem.mp4|0.7
reel-roman-mitride-2|$S/insta/reel-2.mov|$S/insta/ig-DJ6vlHuMd2u.mp4|0
reel-roman-mitride-3|$S/insta/ig-DDH2P0vNPvK.mp4|$S/insta/ig-DDH2P0vNPvK.mp4|0
"
echo "$REELS" | while IFS='|' read -r name vid aud off; do
  [ -z "$name" ] && continue
  ffmpeg -nostdin -v error -y -i "$vid" -ss "$off" -i "$aud" -map 0:v:0 -map 1:a:0 -shortest     -vf "scale=720:-2,fps=30" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart     -c:a aac -b:a 128k "$O/$name.mp4"
  rm -f "$O/$name.webm"
  ffmpeg -nostdin -v error -y -ss 3 -i "$vid" -frames:v 1 -vf "scale=720:-2" -q:v 3 "$P/$name.jpg"
  printf '%-40s mp4 %6s
' "$name" "$(du -h "$O/$name.mp4" | cut -f1)"
done
