// Renders a 1200×630 social card for every article that doesn't have one yet, plus the default card
// and the PNG icons:
//   npm run og            (add --force to re-render all)
// Uses the locally installed Edge/Chrome in headless mode — no extra dependencies.
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root    = resolve(import.meta.dirname, '..');
const blogDir = join(root, 'src/content/blog');
const assets  = join(root, 'public/assets');
const outDir  = join(assets, 'og');
const fonts   = pathToFileURL(join(assets, 'fonts')).href;
const force   = process.argv.includes('--force');

const CATEGORY = {
  'afectiuni': 'Afecțiuni ale pielii', 'estetica': 'Dermatologie estetică', 'ingrediente': 'Ingrediente',
  'protectie-solara': 'Protecție solară', 'rutine': 'Rutine de îngrijire', 'consultatii': 'Consultații',
};

const candidates = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);
const browser = candidates.find(p => existsSync(p));
if (!browser) throw new Error('No Edge/Chrome found — set BROWSER=/path/to/chrome');

const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const field = (fm, key) => fm.match(new RegExp(`^${key}:\\s*"?(.+?)"?\\s*$`, 'm'))?.[1] ?? '';

const FONTS = `
@font-face{font-family:Fraunces;src:url('${fonts}/fraunces.woff2');font-weight:300 900}
@font-face{font-family:Fraunces;src:url('${fonts}/fraunces-ext.woff2');font-weight:300 900;unicode-range:U+0100-02FF}
@font-face{font-family:Fraunces;font-style:italic;src:url('${fonts}/fraunces-italic.woff2');font-weight:300 900}
@font-face{font-family:Fraunces;font-style:italic;src:url('${fonts}/fraunces-italic-ext.woff2');font-weight:300 900;unicode-range:U+0100-02FF}
@font-face{font-family:Figtree;src:url('${fonts}/figtree.woff2');font-weight:300 900}
@font-face{font-family:Figtree;src:url('${fonts}/figtree-ext.woff2');font-weight:300 900;unicode-range:U+0100-02FF}`;


function card({ title, tag }) {
  const size = title.length > 62 ? 60 : title.length > 42 ? 68 : 80;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#f8f4ee;font-family:Figtree;color:#1b2622}
.rings{position:absolute;width:900px;height:900px;right:-330px;top:-300px;border-radius:50%;
  background:radial-gradient(closest-side,transparent 0 30%,#f8f4ee 100%),repeating-radial-gradient(circle at 46% 54%,rgba(45,90,77,.13) 0 1.5px,transparent 2px 18px)}
.blush{position:absolute;width:640px;height:640px;right:-120px;top:-160px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#f1d9ca,transparent 68%)}
.c{position:absolute;inset:70px 84px 64px;display:flex;flex-direction:column}
.logo{font-family:Fraunces;font-weight:520;font-size:54px;letter-spacing:-1.8px;line-height:1}.logo i{color:#2d5a4d;font-weight:480;font-variation-settings:'SOFT' 100,'WONK' 1}.logo b{position:relative;font-weight:inherit}.logo b:after{content:'';position:absolute;left:64%;bottom:.74em;width:.18em;height:.18em;border-radius:50%;background:#9f4b2b;transform:translateX(-50%)}
.tag{margin-top:auto;font-size:22px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#9f4b2b}
h1{font-family:Fraunces;font-weight:450;font-size:${size}px;line-height:1.06;margin:18px 0 0;letter-spacing:-1px;max-width:1000px}
.f{margin-top:38px;padding-top:22px;border-top:2px solid #e2d8ca;display:flex;justify-content:space-between;font-size:26px;color:#4b5651}
.f b{color:#1b2622;font-weight:600}
</style></head><body><div class="blush"></div><div class="rings"></div>
<div class="c"><div class="logo">der<i>m<b>ı</b></i></div>
<div class="tag">${esc(tag)}</div><h1>${esc(title)}</h1>
<div class="f"><span><b>Dr. Mădălina Iulia Lincu</b> · medic dermatovenerolog</span><span>dermi.ro</span></div></div></body></html>`;
}

function defaultCard() {
  return card({ title: 'Pielea ta, explicată de un medic.', tag: 'Dermatologie · Estetică · Îngrijirea pielii' })
    .replace('<h1>Pielea ta, explicată de un medic.</h1>', '<h1>Pielea ta,<br><i style="color:#2d5a4d">explicată de un medic.</i></h1>');
}

function icon(px) {
  const svg = readFileSync(join(assets, 'favicon.svg'), 'utf8');
  return `<!doctype html><html><head><style>html,body{margin:0;width:${px}px;height:${px}px;overflow:hidden;background:transparent}svg{width:${px}px;height:${px}px;display:block}</style></head><body>${svg}</body></html>`;
}

function shoot(html, png, w = 1200, h = 630) {
  const work = join(tmpdir(), `dermi-og-${process.pid}-${Date.now()}`);
  mkdirSync(work, { recursive: true });
  const page = join(work, 'card.html');
  writeFileSync(page, html);
  rmSync(png, { force: true });
  return new Promise((ok, fail) => {
    const p = spawn(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
      `--user-data-dir=${join(work, 'profile')}`, '--force-device-scale-factor=1', `--window-size=${w},${h}`,
      '--default-background-color=00000000', `--screenshot=${png}`, pathToFileURL(page).href], { stdio: 'ignore' });
    p.on('error', fail);
    // Edge on Windows may return before the file is written — wait for it
    p.on('exit', () => {
      const t0 = Date.now();
      const poll = () => existsSync(png) && statSync(png).size > 0 ? ok()
        : Date.now() - t0 > 30000 ? fail(new Error(`Timed out rendering ${png}`)) : setTimeout(poll, 250);
      poll();
    });
  }).finally(() => {
    try { rmSync(work, { recursive: true, force: true, maxRetries: 5, retryDelay: 400 }); } catch {}
  });
}

mkdirSync(outDir, { recursive: true });

const fixed = [
  ['og-image.png', defaultCard, 1200, 630],
  ['icon-512.png', () => icon(512), 512, 512],
  // Smaller icons (192, 180, 32 px) are downscaled from icon-512.png — headless browsers have a
  // minimum window width, so they can't be rendered directly at that size.
];
for (const [name, html, w, h] of fixed) {
  const png = join(assets, name);
  if (existsSync(png) && !force) continue;
  await shoot(html(), png, w, h);
  console.log(`✓ ${name}`);
}

for (const file of readdirSync(blogDir).filter(f => f.endsWith('.md') && !f.startsWith('_'))) {
  const slug = file.replace(/\.md$/, '');
  const png  = join(outDir, `${slug}.png`);
  if (existsSync(png) && !force) continue;
  const fm = readFileSync(join(blogDir, file), 'utf8').split('---')[1] ?? '';
  await shoot(card({ title: field(fm, 'title'), tag: CATEGORY[field(fm, 'category')] ?? 'Dermatologie' }), png);
  console.log(`✓ og/${slug}.png`);
}
