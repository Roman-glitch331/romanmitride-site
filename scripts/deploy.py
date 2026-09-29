"""Déploie dist/ sur le VPS et régénère la config Caddy.
Usage : python scripts/deploy.py preview   -> http://IP:8080 (avant la bascule DNS)
        python scripts/deploy.py prod      -> https://romanmitride.fr
Prérequis : clé SSH ~/.ssh/bmx_vps_ed25519, compte ubuntu sur le VPS."""
import base64, glob, hashlib, io, os, re, subprocess, sys, tarfile, time

MODE = sys.argv[1] if len(sys.argv) > 1 else 'preview'
HOST = 'ubuntu@141.227.131.195'
KEY = os.path.expanduser('~/.ssh/bmx_vps_ed25519')
ROOT = os.path.join(os.path.dirname(__file__), '..')
DIST = os.path.join(ROOT, 'dist')

def ssh(cmd, data=None):
    r = subprocess.run(['ssh', '-i', KEY, '-o', 'BatchMode=yes', HOST, cmd], input=data, capture_output=True)
    if r.returncode: sys.exit(f'Échec SSH : {cmd}\n{r.stderr.decode(errors="replace")}')
    return r.stdout.decode(errors='replace')

print('1/4 build'); subprocess.run('npm run build', shell=True, cwd=ROOT, check=True, stdout=subprocess.DEVNULL)

print('2/4 CSP (empreintes des scripts et styles intégrés)')
def h(s): return "'sha256-" + base64.b64encode(hashlib.sha256(s.encode()).digest()).decode() + "'"
scripts, styles = set(), set()
for f in glob.glob(os.path.join(DIST, '**', '*.html'), recursive=True):
    html = open(f, encoding='utf-8').read()
    for attrs, body in re.findall(r'<script(?![^>]*\bsrc=)([^>]*)>(.*?)</script>', html, re.S):
        if 'ld+json' not in attrs: scripts.add(h(body))
    for body in re.findall(r'<style[^>]*>(.*?)</style>', html, re.S): styles.add(h(body))
umami = 'https://stats.romanmitride.fr'
csp = '; '.join([
    "default-src 'self'",
    "script-src 'self' https://challenges.cloudflare.com " + umami + ' ' + ' '.join(sorted(scripts)),
    "style-src 'self' " + ' '.join(sorted(styles)),
    "img-src 'self' data:",
    "media-src 'self'",
    "font-src 'self'",
    "connect-src 'self' https://formspree.io " + umami,
    "frame-src https://challenges.cloudflare.com",
    "form-action 'self' https://formspree.io",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests" if MODE == 'prod' else '',
]).strip('; ')

sites = {
    'preview': 'http://:8080 {\n\timport site\n}',
    'prod': 'romanmitride.fr {\n\timport site\n}\n\nwww.romanmitride.fr {\n\tredir https://romanmitride.fr{uri} permanent\n}',
}[MODE]
caddyfile = open(os.path.join(ROOT, 'deploy', 'Caddyfile.tmpl'), encoding='utf-8').read().replace('__CSP__', csp).replace('__SITES__', sites)
if MODE == 'preview':  # pas de HSTS ni d'upgrade en HTTP de prévisualisation
    caddyfile = caddyfile.replace('\t\tStrict-Transport-Security "max-age=31536000; includeSubDomains"\n', '')

print('3/4 envoi du site')
rel = time.strftime('%Y%m%d-%H%M%S')
buf = io.BytesIO()
with tarfile.open(fileobj=buf, mode='w:gz') as t: t.add(DIST, arcname='.')
ssh(f'sudo mkdir -p /var/www/romanmitride/releases/{rel} && sudo tar -xzf - -C /var/www/romanmitride/releases/{rel}', buf.getvalue())
ssh(f'sudo ln -sfn /var/www/romanmitride/releases/{rel} /var/www/romanmitride/current && sudo chmod -R a+rX /var/www/romanmitride'
    ' && cd /var/www/romanmitride/releases && ls -1t | tail -n +6 | xargs -r sudo rm -rf')

print('4/4 config Caddy')
ssh('sudo tee /etc/caddy/Caddyfile >/dev/null', caddyfile.encode())
print(ssh('sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile 2>&1 | tail -1 && sudo systemctl reload caddy && echo rechargé'))
print(f'Déployé ({MODE}) : version {rel}')
