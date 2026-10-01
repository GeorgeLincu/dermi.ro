// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://dermi.ro',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // The CSP forbids inline <style>/<script>: always emit external, hashed files
    inlineStylesheets: 'never',
  },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
  markdown: {
    // Prism emits CSS classes; Shiki's inline style="" would break the CSP
    syntaxHighlight: 'prism',
  },
});
