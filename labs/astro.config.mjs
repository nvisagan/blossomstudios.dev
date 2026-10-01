// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Labs is a fully static site. Experiments live as plain files under
// public/x/<slug>/ and are served untouched.
export default defineConfig({
  site: 'https://labs.blossomstudios.dev',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
