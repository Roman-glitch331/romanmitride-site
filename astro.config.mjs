import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://romanmitride.fr',
  // 'preserve' : src/pages/confidentialite.html.astro -> /confidentialite.html
  // (URL déclarée dans l'application OAuth Google, elle ne doit pas changer).
  build: { format: 'preserve' },
  trailingSlash: 'never',
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
