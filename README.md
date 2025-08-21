
# Dermi.ro — Jekyll + GitHub Pages starter 

A clean, fast dermatology site with blog and optional shop. Built with Jekyll and the Minimal Mistakes theme.

## Quick start (GitHub Pages)
1. Create a GitHub repository and upload this folder.
2. In **Settings → Pages**, choose **GitHub Actions** (Jekyll) or a branch as the source to publish.
3. (Custom domain) In **Settings → Pages**, set the custom domain to `dermi.ro`. This will create or manage the `CNAME` automatically.
4. Configure your DNS per GitHub’s docs (ALIAS/ANAME or A records for the apex). HTTPS will be issued automatically.

## Alternative: Netlify
1. Click **New site from Git** and select your repo.
2. Build command: `bundle exec jekyll build` — Publish directory: `_site/`.
3. Add the custom domain `dermi.ro` in **Site configuration → Domains** and follow the external DNS instructions.

## Edit content
- Blog posts: `_posts/` (Markdown).
- Pages: `_pages/`.
- Shop products: `_data/products.yml`. Replace `YOUR_SNIPCART_PUBLIC_API_KEY` in `_pages/shop.md`.
- Contact form: replace `YOUR_FORM_ID` in `_pages/contact.md` (Formspree).

## Local build
```bash
bundle install
bundle exec jekyll serve
```

## Notes
- Theme: Minimal Mistakes (remote_theme). Do not remove `jekyll-include-cache` from plugins.
- Images are placeholders. Replace with your own.
