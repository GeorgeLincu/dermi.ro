// Shared headless-browser rendering for generated images (og-images.mjs, social-assets.mjs).
// Uses the locally installed Edge/Chrome — no extra dependencies.
import { writeFileSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const root   = resolve(import.meta.dirname, '../..');
export const assets = join(root, 'public/assets');
const fonts = pathToFileURL(join(assets, 'fonts')).href;

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

export const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const FONTS = `
@font-face{font-family:Fraunces;src:url('${fonts}/fraunces.woff2');font-weight:300 900}
@font-face{font-family:Fraunces;src:url('${fonts}/fraunces-ext.woff2');font-weight:300 900;unicode-range:U+0100-02FF}
@font-face{font-family:Fraunces;font-style:italic;src:url('${fonts}/fraunces-italic.woff2');font-weight:300 900}
@font-face{font-family:Fraunces;font-style:italic;src:url('${fonts}/fraunces-italic-ext.woff2');font-weight:300 900;unicode-range:U+0100-02FF}
@font-face{font-family:Figtree;src:url('${fonts}/figtree.woff2');font-weight:300 900}
@font-face{font-family:Figtree;src:url('${fonts}/figtree-ext.woff2');font-weight:300 900;unicode-range:U+0100-02FF}`;

export function shoot(html, png, w = 1200, h = 630) {
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
