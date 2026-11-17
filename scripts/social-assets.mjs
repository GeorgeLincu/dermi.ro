// Renders the social media brand kit (profile pictures, covers, post/video templates) into brand/social/:
//   npm run social        (add --force to re-render all)
// Sizes and where each file goes: docs/SOCIAL-MEDIA.md. Rendering helper: scripts/lib/render.mjs.
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { root, assets, FONTS, shoot } from './lib/render.mjs';

const outDir = join(root, 'brand/social');
const force  = process.argv.includes('--force');

const C = { bg: '#f8f4ee', ink: '#1b2622', ink2: '#4b5651', line: '#e2d8ca', green: '#2d5a4d',
  greenLight: '#93c9b2', clay: '#9f4b2b', peach: '#e7b49b', blush: '#f1d9ca' };
const DOCTOR = 'Dr. Mădălina Iulia Lincu';
const TITLE  = 'medic specialist dermatovenerologie';
const TAGLINE = ['Pielea ta,', 'explicată de un medic.'];

// The seal from the favicon without its rounded-square background (the page provides the background)
const MARK = readFileSync(join(assets, 'favicon.svg'), 'utf8').replace(/<rect[^>]*\/>/, '');

// der·mi wordmark — same construction as the site header and the OG cards
const LOGO_CSS = (dark) => `.logo{font-family:Fraunces;font-weight:520;letter-spacing:-.033em;line-height:1;color:${dark ? C.bg : C.ink}}
.logo i{color:${dark ? C.greenLight : C.green};font-weight:480;font-variation-settings:'SOFT' 100,'WONK' 1}
.logo b{position:relative;font-weight:inherit}
.logo b:after{content:'';position:absolute;left:64%;bottom:.74em;width:.18em;height:.18em;border-radius:50%;background:${dark ? C.peach : C.clay};transform:translateX(-50%)}`;
const LOGO = '<span class="logo">der<i>m<b>ı</b></i></span>';

const RINGS = `.rings{position:absolute;border-radius:50%;
  background:radial-gradient(closest-side,transparent 0 30%,${C.bg} 100%),repeating-radial-gradient(circle at 46% 54%,rgba(45,90,77,.13) 0 1.5px,transparent 2px 18px)}
.blush{position:absolute;border-radius:50%;background:radial-gradient(circle at 40% 40%,${C.blush},transparent 68%)}`;

function page(w, h, css, body, { dark = false, transparent = false } = {}) {
  const bg = transparent ? 'transparent' : dark ? C.green : C.bg;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:${bg};font-family:Figtree;color:${dark ? C.bg : C.ink}}
*{box-sizing:border-box}${LOGO_CSS(dark)}${RINGS}${css}</style></head><body>${body}</body></html>`;
}

// ── Profile picture (all four platforms crop it to a circle) ───────────────────────────────────────
const profile = () => page(1080, 1080,
  `.m{position:absolute;left:100px;top:100px;width:880px;height:880px}.m svg{width:100%;height:100%;display:block}`,
  `<div class="m">${MARK}</div>`, { dark: true });

// YouTube watermark (shown small over videos): the full seal on a transparent background
const watermark = () => page(600, 600, `svg{width:600px;height:600px;display:block}`,
  readFileSync(join(assets, 'favicon.svg'), 'utf8'), { transparent: true });

// ── Covers ──────────────────────────────────────────────────────────────────────────────────────────
const facebookCover = () => page(1640, 624,
  `.rings{width:1100px;height:1100px;right:-380px;top:-420px}.blush{width:760px;height:760px;right:-140px;top:-240px}
.c{position:absolute;left:265px;right:265px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
.logo{font-size:92px}h1{font-family:Fraunces;font-weight:440;font-size:64px;line-height:1.08;margin:30px 0 0;letter-spacing:-1px}
h1 i{color:${C.green}}p{margin:24px 0 0;font-size:28px;color:${C.ink2}}p b{color:${C.ink};font-weight:600}`,
  `<div class="blush"></div><div class="rings"></div><div class="c">${LOGO}
<h1>${TAGLINE[0]} <i>${TAGLINE[1]}</i></h1><p><b>${DOCTOR}</b> · ${TITLE}</p></div>`);

// YouTube shows the whole 2560×1440 only on TVs; text stays inside the central 1546×423 safe area
const youtubeBanner = () => page(2560, 1440,
  `.rings{width:1700px;height:1700px;right:-300px;top:-140px;opacity:.9}.blush{width:1200px;height:1200px;right:60px;top:40px}
.c{position:absolute;left:507px;top:508px;width:1546px;height:423px;display:flex;align-items:center;justify-content:space-between;gap:60px}
.logo{font-size:150px}.t{text-align:right}h1{font-family:Fraunces;font-weight:440;font-size:72px;line-height:1.05;margin:0;letter-spacing:-1.2px}
h1 i{color:${C.green}}p{margin:22px 0 0;font-size:34px;color:${C.ink2}}p b{color:${C.ink};font-weight:600}`,
  `<div class="blush"></div><div class="rings"></div><div class="c">${LOGO}
<div class="t"><h1>${TAGLINE[0]}<br><i>${TAGLINE[1]}</i></h1><p><b>${DOCTOR}</b><br>${TITLE} · dermi.ro</p></div></div>`);

// ── Post templates (placeholders are replaced in Canva) ──────────────────────────────────────────────
const footer = `<div class="f"><span><b>${DOCTOR}</b> · ${TITLE}</span><span>dermi.ro</span></div>`;
const POST_CSS = (w, h) => `.rings{width:${w * .9}px;height:${w * .9}px;right:-${w * .32}px;top:-${w * .28}px}
.blush{width:${w * .6}px;height:${w * .6}px;right:-${w * .1}px;top:-${w * .15}px}
.c{position:absolute;inset:80px 80px 70px;display:flex;flex-direction:column}.logo{font-size:52px}
.tag{font-size:24px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:${C.clay}}
h1{font-family:Fraunces;font-weight:450;line-height:1.06;margin:22px 0 0;letter-spacing:-1px}h1 i{color:${C.green}}
.f{margin-top:auto;padding-top:24px;border-top:2px solid ${C.line};display:flex;justify-content:space-between;gap:24px;font-size:23px;color:${C.ink2}}
.f b{color:${C.ink};font-weight:600}`;

const carouselCover = () => page(1080, 1350, POST_CSS(1080, 1350) +
  `.tag{margin-top:auto}h1{font-size:104px}.f{margin-top:0}.swipe{margin:40px 0 70px;font-size:28px;font-weight:600;color:${C.green}}`,
  `<div class="blush"></div><div class="rings"></div><div class="c">${LOGO}
<div class="tag">Mit vs. fapt</div><h1>Titlul postării <i>în două rânduri</i></h1>
<div class="swipe">Glisează →</div>${footer}</div>`);

const carouselSlide = () => page(1080, 1350, POST_CSS(1080, 1350) +
  `.n{font-family:Fraunces;font-size:150px;font-weight:400;color:${C.green};line-height:1;margin-top:40px}
h1{font-size:72px}.b{margin-top:34px;font-size:38px;line-height:1.45;color:${C.ink2}}.b p{margin:0 0 22px}`,
  `<div class="c">${LOGO}<div class="n">02</div><h1>Ideea principală a slide-ului</h1>
<div class="b"><p>Două-trei fraze scurte, clare, fără termeni greu de înțeles.</p><p>Maximum 40 de cuvinte pe slide.</p></div>${footer}</div>`);

const carouselEnd = () => page(1080, 1350, POST_CSS(1080, 1350) +
  `h1{font-size:84px;margin-top:auto}.url{margin-top:36px;display:inline-block;align-self:flex-start;padding:22px 34px;border-radius:999px;background:${C.green};color:${C.bg};font-size:36px;font-weight:600}
.note{margin:56px 0 40px;font-size:26px;line-height:1.45;color:${C.ink2}}`,
  `<div class="blush"></div><div class="rings"></div><div class="c">${LOGO}
<h1>Articolul complet, <i>cu surse</i></h1><div class="url">dermi.ro</div>
<div class="note">Informații generale, cu scop educativ. Nu înlocuiesc consultația medicală.<br>Pentru o problemă a pielii, adresează-te unui medic dermatolog.</div>${footer}</div>`);

const mythFact = () => page(1080, 1080,
  `.h{position:absolute;left:0;right:0;padding:70px 80px;height:50%;display:flex;flex-direction:column;justify-content:center}
.top{top:0}.bot{bottom:0;background:${C.green};color:${C.bg}}
.k{font-size:26px;font-weight:700;letter-spacing:5px;text-transform:uppercase}.top .k{color:${C.clay}}.bot .k{color:${C.peach}}
.t{font-family:Fraunces;font-weight:450;font-size:58px;line-height:1.1;margin-top:18px;letter-spacing:-.8px}
.top .t{text-decoration:line-through;text-decoration-thickness:3px;text-decoration-color:${C.clay}}
.logo{position:absolute;right:80px;top:64px;font-size:40px}.u{position:absolute;right:80px;bottom:56px;font-size:24px;color:${C.greenLight}}`,
  `<div class="h top"><div class="k">Mit</div><div class="t">Afirmația greșită, pe scurt</div></div>
<div class="h bot"><div class="k">Fapt</div><div class="t">Ce spun de fapt dovezile</div></div>${LOGO}<div class="u">dermi.ro</div>`);

// ── Vertical video (Reels, TikTok, Shorts, Stories) ─────────────────────────────────────────────────
// Platform UI covers roughly the top 250 px, the bottom 420 px and a 160 px column on the right
const SAFE = { top: 250, bottom: 420, side: 80, right: 160 };
const verticalCover = () => page(1080, 1920,
  `.rings{width:1100px;height:1100px;right:-420px;top:-200px}.blush{width:800px;height:800px;right:-200px;top:-80px}
.c{position:absolute;left:${SAFE.side}px;right:${SAFE.right}px;top:${SAFE.top}px;bottom:${SAFE.bottom}px;display:flex;flex-direction:column;justify-content:center}
.logo{font-size:60px}.tag{margin-top:70px;font-size:28px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:${C.clay}}
h1{font-family:Fraunces;font-weight:450;font-size:108px;line-height:1.04;margin:24px 0 0;letter-spacing:-1.4px}h1 i{color:${C.green}}
p{margin:44px 0 0;font-size:30px;color:${C.ink2}}p b{color:${C.ink};font-weight:600}`,
  `<div class="blush"></div><div class="rings"></div><div class="c">${LOGO}
<div class="tag">Ingredientul lunii</div><h1>Titlul clipului <i>în 3–6 cuvinte</i></h1><p><b>${DOCTOR}</b><br>${TITLE}</p></div>`);

const safeZones = () => page(1080, 1920,
  `.z{position:absolute;background:rgba(159,75,43,.18);border:3px dashed ${C.clay};display:flex;align-items:center;justify-content:center;
font-size:30px;font-weight:600;color:${C.clay};text-align:center;padding:20px}
#t{left:0;right:0;top:0;height:${SAFE.top}px}#b{left:0;right:0;bottom:0;height:${SAFE.bottom}px}
#r{right:0;top:${SAFE.top}px;bottom:${SAFE.bottom}px;width:${SAFE.right}px;writing-mode:vertical-rl}
.ok{position:absolute;left:${SAFE.side}px;right:${SAFE.right}px;top:${SAFE.top}px;bottom:${SAFE.bottom}px;border:4px solid ${C.green};
display:flex;align-items:center;justify-content:center;text-align:center;font-size:40px;font-weight:600;color:${C.green};padding:40px}`,
  `<div class="z" id="t">Sus: nume cont, butoane (${SAFE.top} px)</div>
<div class="z" id="b">Jos: descriere, sunet, butoane (${SAFE.bottom} px)</div>
<div class="z" id="r">Like, comentarii, share</div>
<div class="ok">Zona sigură pentru text și fața medicului<br>(Reels · TikTok · Shorts · Stories)</div>`);

// ── YouTube thumbnail (right side left free for the doctor's photo) ─────────────────────────────────
const youtubeThumb = () => page(1280, 720,
  `.c{position:absolute;left:70px;top:60px;bottom:60px;width:720px;display:flex;flex-direction:column}
.logo{font-size:44px}h1{font-family:Fraunces;font-weight:520;font-size:96px;line-height:1;margin:auto 0 0;letter-spacing:-1.6px}h1 i{color:${C.green}}
.ph{position:absolute;right:0;top:0;bottom:0;width:440px;background:${C.blush};display:flex;align-items:center;justify-content:center;font-size:26px;color:${C.ink2};text-align:center;padding:30px}
.bar{position:absolute;left:0;bottom:0;width:840px;height:14px;background:${C.clay}}`,
  `<div class="c">${LOGO}<h1>Titlu scurt <i>și clar</i></h1></div><div class="ph">Fotografia medicului<br>(decupată, fundal neutru)</div><div class="bar"></div>`);

// ── Instagram Story Highlight covers (one per content pillar; shown cropped to a circle) ────────────
const ICONS = {
  'mit-vs-fapt':    '<path d="M38 42a12 12 0 1 1 18 10c-4 2-6 4-6 9M50 72v1"/>',
  'ingrediente':    '<path d="M50 22c12 18 20 28 20 40a20 20 0 0 1-40 0c0-12 8-22 20-40Z"/>',
  'rutina':         '<path d="M26 34h48M26 50h48M26 66h30"/><circle cx="74" cy="66" r="3"/>',
  'la-dermatolog':  '<path d="M50 26v48M26 50h48"/>',
  'protectie-solara': '<circle cx="50" cy="50" r="13"/><path d="M50 20v8M50 72v8M20 50h8M72 50h8M29 29l6 6M65 65l6 6M29 71l6-6M65 35l6-6"/>',
};
const highlight = (key) => () => page(1080, 1920,
  `.i{position:absolute;left:290px;top:710px;width:500px;height:500px}.i svg{width:100%;height:100%}`,
  `<div class="i"><svg viewBox="0 0 100 100" fill="none" stroke="${C.bg}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${ICONS[key]}</svg></div>`,
  { dark: true });

const JOBS = [
  ['profile-1080.png', profile, 1080, 1080],
  ['youtube-watermark-600.png', watermark, 600, 600],
  ['facebook-cover-1640x624.png', facebookCover, 1640, 624],
  ['youtube-banner-2560x1440.png', youtubeBanner, 2560, 1440],
  ['post-carousel-cover-1080x1350.png', carouselCover, 1080, 1350],
  ['post-carousel-slide-1080x1350.png', carouselSlide, 1080, 1350],
  ['post-carousel-end-1080x1350.png', carouselEnd, 1080, 1350],
  ['post-myth-fact-1080x1080.png', mythFact, 1080, 1080],
  ['vertical-cover-1080x1920.png', verticalCover, 1080, 1920],
  ['vertical-safe-zones-1080x1920.png', safeZones, 1080, 1920],
  ['youtube-thumbnail-1280x720.png', youtubeThumb, 1280, 720],
  ...Object.keys(ICONS).map(k => [`highlight-${k}-1080x1920.png`, highlight(k), 1080, 1920]),
];

mkdirSync(outDir, { recursive: true });
for (const [name, html, w, h] of JOBS) {
  const png = join(outDir, name);
  if (existsSync(png) && !force) continue;
  await shoot(html(), png, w, h);
  console.log(`✓ brand/social/${name}`);
}
