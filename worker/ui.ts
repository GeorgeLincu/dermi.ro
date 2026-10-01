// Vault front end — served by the Worker so it is only reachable after sign-in.
// No inline scripts or styles: the vault CSP only allows 'self'. UI language: Romanian.

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

const head = (title: string) => `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${esc(title)} — Dermi Vault</title>
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
  <link rel="stylesheet" href="/vault/app.css" />
  <script src="/theme-init.js"></script>
</head>`;

const header = `
  <header class="v-top">
    <a href="/" class="v-logo">der<i>m<b>ı</b></i></a>
    <span class="v-badge">Vault</span>
    <span class="v-spacer"></span>
    <span class="v-user" id="user"></span>
    <a class="v-btn v-btn--ghost" href="/cdn-cgi/access/logout">Ieșire</a>
  </header>`;

/** A simple private page (Markdown pages, errors). `body` must already be safe HTML. */
export const pageHtml = (title: string, body: string) => `${head(title)}
<body>
${header}
  <main class="v-main v-prose">
    <p><a href="/vault/">← Vault</a></p>
    ${body}
  </main>
</body>
</html>`;

export const APP_HTML = `${head('Vault')}
<body>
${header}
  <main class="v-main">
    <nav class="v-tabs" id="tabs" aria-label="Secțiuni" hidden>
      <a href="#!articles" data-tab="articles">Articole</a>
      <a href="#/" data-tab="files">Fișiere</a>
    </nav>
    <p class="v-note" id="setupNote" hidden></p>

    <section id="filesView">
      <nav class="v-crumbs" id="crumbs" aria-label="Dosar"></nav>
      <div class="v-toolbar" id="adminBar" hidden>
        <label class="v-btn v-btn--primary">Încarcă fișiere<input type="file" id="fileInput" multiple hidden /></label>
        <button class="v-btn v-btn--ghost" id="newFolder" type="button">Dosar nou</button>
        <span class="v-hint">…sau trage fișierele oriunde pe pagină</span>
      </div>
      <div id="uploads" class="v-uploads"></div>
      <table class="v-table">
        <thead><tr><th>Nume</th><th class="v-num">Mărime</th><th>Modificat</th><th class="v-actions-h"><span class="v-sr">Acțiuni</span></th></tr></thead>
        <tbody id="rows"><tr><td colspan="4" class="v-empty">Se încarcă…</td></tr></tbody>
      </table>
      <p class="v-foot">Dosarele <code>people/&lt;email&gt;/</code> sunt vizibile doar persoanei respective. Fișierele Markdown (<code>.md</code>) se deschid ca pagini.</p>
    </section>

    <section id="articlesView" hidden>
      <div id="articleList">
        <div class="v-toolbar">
          <a class="v-btn v-btn--primary" href="#!new">Articol nou</a>
          <a class="v-btn v-btn--ghost" href="/blog/" target="_blank" rel="noopener">Vezi site-ul ↗</a>
          <label class="v-filter">Arată
            <select id="postFilter">
              <option value="all">toate</option>
              <option value="draft">ciorne</option>
              <option value="live">publicate</option>
            </select>
          </label>
        </div>
        <table class="v-table">
          <thead><tr><th>Titlu</th><th>Temă</th><th>Stare</th><th>Data</th><th class="v-actions-h"><span class="v-sr">Acțiuni</span></th></tr></thead>
          <tbody id="postRows"><tr><td colspan="5" class="v-empty">Se încarcă…</td></tr></tbody>
        </table>
        <p class="v-foot">La publicare, articolul se salvează în GitHub; site-ul se reconstruiește și articolul apare în 1–2 minute. „TODO” = articolul mai conține note de completat și nu poate fi publicat.</p>
      </div>

      <form id="editor" class="v-editor" hidden novalidate>
        <p><a href="#!articles">← Toate articolele</a></p>
        <h2 id="editorTitle">Articol nou</h2>
        <label>Titlu <span class="v-muted v-small">— ideal 40–65 de caractere (<span id="titleCount">0</span>)</span>
          <input id="fTitle" maxlength="110" required /></label>
        <label>Adresa <span class="v-muted v-small">dermi.ro/blog/<b id="slugPreview">…</b>/</span>
          <input id="fSlug" maxlength="90" pattern="[a-z0-9]+(-[a-z0-9]+)*" required /></label>
        <label>Descriere <span class="v-muted v-small">— apare în Google și la distribuire (<span id="descCount">0</span>/50–170)</span>
          <textarea id="fDesc" rows="2" maxlength="170" required></textarea></label>
        <div class="v-row3">
          <label>Temă
            <select id="fCategory" required>
              <option value="">— alege —</option>
              <option value="afectiuni">Afecțiuni ale pielii</option>
              <option value="venerologie">Venerologie</option>
              <option value="ingrediente">Ingrediente</option>
              <option value="protectie-solara">Protecție solară</option>
              <option value="rutine">Rutine de îngrijire</option>
              <option value="consultatii">Consultații și investigații</option>
            </select></label>
          <label>Etichete <span class="v-muted v-small">separate prin virgulă</span><input id="fTags" placeholder="acnee, adulți" /></label>
          <label>Data <input id="fDate" type="date" required /></label>
        </div>

        <fieldset class="v-box">
          <legend>Imagine principală (opțional)</legend>
          <div class="v-cover">
            <img id="coverPreview" alt="" hidden />
            <div class="v-cover-fields">
              <div class="v-editor-bar">
                <label class="v-btn v-btn--ghost v-btn--sm">Alege imaginea<input type="file" id="fCover" accept="image/png,image/jpeg,image/webp,image/avif" hidden /></label>
                <button type="button" class="v-btn v-btn--ghost v-btn--sm" id="coverRemove" hidden>Elimină</button>
              </div>
              <label>Descrierea imaginii (text alternativ) <input id="fCoverAlt" maxlength="200" placeholder="ex.: dermatoscop folosit la examinarea unei alunițe" /></label>
              <p class="v-muted v-small">Folosește doar fotografii proprii sau cu licență care permite utilizarea. Nu publica fotografii cu pacienți fără acordul lor scris.</p>
            </div>
          </div>
        </fieldset>

        <div class="v-editor-bar">
          <label class="v-btn v-btn--ghost v-btn--sm">Inserează imagine<input type="file" id="fImage" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" hidden /></label>
          <button type="button" class="v-btn v-btn--ghost v-btn--sm" id="previewBtn">Previzualizare</button>
          <span class="v-muted v-small">Markdown: ## subtitlu · **îngroșat** · [link](https://…) · - listă · &gt; citat</span>
        </div>
        <textarea id="fBody" class="v-body" rows="24" spellcheck="true" lang="ro" placeholder="Scrie articolul în Markdown…"></textarea>
        <div id="previewPane" class="v-prose v-preview" hidden></div>

        <label>Întrebări frecvente <span class="v-muted v-small">— câte un bloc: un rând „Î: întrebarea”, un rând „R: răspunsul”, apoi un rând gol</span>
          <textarea id="fFaq" rows="8" placeholder="Î: Acneea la adulți trece singură?&#10;R: Uneori se ameliorează, dar…"></textarea></label>
        <label>Surse <span class="v-muted v-small">— câte una pe rând: Titlu | Editor | https://link (editorul și linkul sunt opționale)</span>
          <textarea id="fSources" rows="5" placeholder="Guidelines of care for the management of acne vulgaris | American Academy of Dermatology | https://…"></textarea></label>

        <div id="warnings" class="v-warn" role="status" hidden></div>
        <label class="v-check"><input type="checkbox" id="fDraft" checked /> Ciornă — nu apare pe site</label>
        <div class="v-toolbar">
          <button type="submit" class="v-btn v-btn--primary" id="saveBtn">Salvează ciorna</button>
          <button type="button" class="v-btn v-btn--ghost v-btn--danger" id="deleteBtn" hidden>Șterge</button>
          <span id="saveStatus" class="v-muted" role="status" aria-live="polite"></span>
        </div>
      </form>
    </section>
  </main>

  <div class="v-drop" id="drop" hidden><p>Eliberează pentru a încărca</p></div>

  <dialog id="shareDialog" class="v-dialog">
    <form method="dialog">
      <h2>Link de partajare</h2>
      <p class="v-muted" id="shareName"></p>
      <label>Valabil
        <select id="shareHours">
          <option value="1">1 oră</option>
          <option value="24" selected>1 zi</option>
          <option value="168">7 zile</option>
          <option value="720">30 de zile</option>
        </select>
      </label>
      <button class="v-btn v-btn--primary" id="shareCreate" type="button">Creează linkul</button>
      <div id="shareResult" hidden>
        <input id="shareUrl" readonly />
        <button class="v-btn v-btn--ghost" id="shareCopy" type="button">Copiază</button>
        <p class="v-muted" id="shareExpires"></p>
      </div>
      <p class="v-muted v-small">Oricine are linkul poate descărca fișierul până la expirare, fără autentificare.</p>
      <button class="v-btn v-btn--ghost" value="close">Închide</button>
    </form>
  </dialog>

  <script type="module" src="/vault/app.js"></script>
</body>
</html>`;

export const APP_CSS = `
@font-face { font-family: 'Figtree'; font-weight: 300 900; font-display: swap; src: url('/assets/fonts/figtree.woff2') format('woff2'); unicode-range: U+0000-00FF, U+2000-206F; }
@font-face { font-family: 'Figtree'; font-weight: 300 900; font-display: swap; src: url('/assets/fonts/figtree-ext.woff2') format('woff2'); unicode-range: U+0100-02FF; }
@font-face { font-family: 'Fraunces'; font-weight: 300 900; font-display: swap; src: url('/assets/fonts/fraunces.woff2') format('woff2'); unicode-range: U+0000-00FF, U+2000-206F; }
@font-face { font-family: 'Fraunces'; font-weight: 300 900; font-display: swap; src: url('/assets/fonts/fraunces-ext.woff2') format('woff2'); unicode-range: U+0100-02FF; }
@font-face { font-family: 'Fraunces'; font-style: italic; font-weight: 300 900; font-display: swap; src: url('/assets/fonts/fraunces-italic.woff2') format('woff2'); }
:root {
  color-scheme: light;
  --bg: #f8f4ee; --card: #fffdf9; --tint: #f1eae0; --border: #e2d8ca; --border-h: #cdbfad;
  --text: #1b2622; --soft: #33403b; --muted: #5a6560; --accent: #2d5a4d; --accent-2: #3d7464; --on-accent: #fff;
  --clay: #9f4b2b; --danger: #a8321c; --ok: #2d6a4f; --row-h: rgba(45,90,77,.05); --warn-bg: #fbeee4;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  color-scheme: dark; --bg: #111915; --card: #17211d; --tint: #1d2924; --border: #2a3832; --border-h: #3b4c45;
  --text: #efe8dd; --soft: #d3cdc3; --muted: #a7b0a9; --accent: #93c9b2; --accent-2: #b0dcc9; --on-accent: #0f1a16;
  --clay: #eba183; --danger: #f2a08c; --ok: #93c9b2; --row-h: rgba(147,201,178,.06); --warn-bg: #2a221d;
} }
:root[data-theme="dark"] {
  color-scheme: dark; --bg: #111915; --card: #17211d; --tint: #1d2924; --border: #2a3832; --border-h: #3b4c45;
  --text: #efe8dd; --soft: #d3cdc3; --muted: #a7b0a9; --accent: #93c9b2; --accent-2: #b0dcc9; --on-accent: #0f1a16;
  --clay: #eba183; --danger: #f2a08c; --ok: #93c9b2; --row-h: rgba(147,201,178,.06); --warn-bg: #2a221d;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.6 Figtree, system-ui, sans-serif; }
a { color: var(--accent); }
[hidden] { display: none !important; }
code { font-size: .9em; background: var(--tint); padding: .1em .35em; border-radius: 4px; }
.v-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.v-top { display: flex; align-items: center; gap: .75rem; padding: .9rem clamp(1rem, 4vw, 2.5rem); border-bottom: 1px solid var(--border); background: var(--card); }
.v-logo { font: 520 1.6rem/1 Fraunces, Georgia, serif; letter-spacing: -.03em; color: var(--text); text-decoration: none; }
.v-logo i { color: var(--accent); }
.v-logo b { position: relative; font-weight: inherit; }
.v-logo b::after { content: ''; position: absolute; left: 64%; bottom: .74em; width: .18em; height: .18em; border-radius: 50%; background: var(--clay); transform: translateX(-50%); }
.v-badge { font-size: .7rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--clay); border: 1px solid var(--border-h); border-radius: 100px; padding: .15rem .6rem; }
.v-spacer { flex: 1; }
.v-user { color: var(--muted); font-size: .85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 40vw; }
.v-main { max-width: 1040px; margin: 0 auto; padding: 2rem clamp(1rem, 4vw, 2.5rem) 4rem; }
.v-note { background: var(--warn-bg); border: 1px solid var(--border-h); border-radius: 12px; padding: .8rem 1rem; }
.v-crumbs { font-size: 1.05rem; margin-bottom: 1.25rem; display: flex; flex-wrap: wrap; gap: .35rem; align-items: center; }
.v-crumbs a { text-decoration: none; }
.v-crumbs span { color: var(--muted); }
.v-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; margin-bottom: 1.25rem; }
.v-filter { margin-left: auto; color: var(--muted); font-size: .9rem; display: inline-flex; gap: .4rem; align-items: center; }
.v-filter select, .v-editor select { padding: .5rem .7rem; border-radius: 10px; border: 1px solid var(--border-h); background: var(--card); color: var(--text); font: inherit; }
.v-hint, .v-muted, .v-foot { color: var(--muted); font-size: .88rem; }
.v-small { font-size: .8rem; }
.v-btn { display: inline-flex; align-items: center; gap: .4rem; border-radius: 100px; padding: .6rem 1.15rem; font: 600 .9rem Figtree, sans-serif; cursor: pointer; border: 1.5px solid transparent; text-decoration: none; min-height: 40px; }
.v-btn--primary { background: var(--accent); color: var(--on-accent); }
.v-btn--primary:hover { background: var(--accent-2); }
.v-btn--primary:disabled { opacity: .6; cursor: progress; }
.v-btn--ghost { background: var(--card); color: var(--soft); border-color: var(--border-h); }
.v-btn--ghost:hover { border-color: var(--accent); color: var(--accent); }
.v-btn--sm { padding: .3rem .8rem; font-size: .82rem; min-height: 34px; }
.v-btn--danger { color: var(--danger); }
.v-btn:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline: 3px solid var(--clay); outline-offset: 2px; }
.v-table { width: 100%; border-collapse: collapse; background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
.v-table th { text-align: left; font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); font-weight: 700; padding: .75rem 1rem; border-bottom: 1px solid var(--border); }
.v-table td { padding: .65rem 1rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
.v-table tr:last-child td { border-bottom: 0; }
.v-table tbody tr:hover { background: var(--row-h); }
.v-num { text-align: right; white-space: nowrap; }
.v-date { color: var(--muted); font-size: .85rem; white-space: nowrap; }
.v-name { word-break: break-word; }
.v-name a { color: var(--text); text-decoration: none; font-weight: 600; }
.v-name a:hover { color: var(--accent); }
.v-icon { display: inline-block; width: 1.4rem; color: var(--muted); }
.v-actions { display: flex; gap: .35rem; justify-content: flex-end; flex-wrap: wrap; }
.v-empty { text-align: center; color: var(--muted); padding: 2.5rem 1rem !important; }
.v-uploads { display: grid; gap: .5rem; margin-bottom: 1rem; }
.v-upload { display: grid; grid-template-columns: 1fr auto; gap: .25rem 1rem; font-size: .85rem; }
.v-upload progress { grid-column: 1 / -1; width: 100%; height: 6px; accent-color: var(--accent); }
.v-upload.error { color: var(--danger); }
.v-drop { position: fixed; inset: 0; background: rgba(45,90,77,.15); border: 3px dashed var(--accent); display: grid; place-items: center; font: 500 1.6rem Fraunces, serif; z-index: 10; pointer-events: none; }
.v-dialog { background: var(--bg); color: var(--text); border: 1px solid var(--border-h); border-radius: 16px; padding: 1.5rem; width: min(480px, 92vw); }
.v-dialog::backdrop { background: rgba(0,0,0,.45); }
.v-dialog form { display: grid; gap: .9rem; }
.v-dialog h2 { margin: 0; font: 500 1.3rem Fraunces, serif; }
.v-dialog select, .v-dialog input { width: 100%; margin-top: .3rem; padding: .55rem .75rem; border-radius: 10px; border: 1px solid var(--border-h); background: var(--card); color: var(--text); font: inherit; }
#shareResult { display: grid; gap: .5rem; }
.v-prose { max-width: 720px; line-height: 1.7; }
.v-prose h1, .v-prose h2, .v-prose h3 { font-family: Fraunces, Georgia, serif; font-weight: 500; line-height: 1.2; }
.v-prose p, .v-prose li { color: var(--soft); }
.v-prose img { max-width: 100%; height: auto; border-radius: 12px; }
.v-prose blockquote { border-left: 3px solid var(--clay); margin-left: 0; padding-left: 1rem; color: var(--muted); font-style: italic; }
.v-prose table { border-collapse: collapse; } .v-prose td, .v-prose th { border: 1px solid var(--border); padding: .4rem .7rem; }
.v-tabs { display: flex; gap: .35rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
.v-tabs a { padding: .6rem 1rem; color: var(--muted); text-decoration: none; border-bottom: 2px solid transparent; margin-bottom: -1px; font-weight: 600; }
.v-tabs a[aria-current="page"] { color: var(--text); border-bottom-color: var(--accent); }
.v-editor { display: grid; gap: 1.1rem; }
.v-editor h2 { margin: 0; font: 500 1.6rem Fraunces, serif; }
.v-editor label { display: grid; gap: .35rem; font-size: .9rem; color: var(--soft); font-weight: 600; }
.v-editor input:not([type="checkbox"]):not([type="file"]), .v-editor textarea {
  width: 100%; padding: .65rem .85rem; border-radius: 10px; border: 1.5px solid var(--border-h);
  background: var(--card); color: var(--text); font: 400 1rem/1.5 Figtree, sans-serif; resize: vertical;
}
.v-editor .v-body { font: .95rem/1.7 ui-monospace, 'Cascadia Code', Consolas, monospace; min-height: 460px; }
.v-row3 { display: grid; grid-template-columns: 1.2fr 1.6fr .9fr; gap: 1rem; }
.v-box { border: 1px solid var(--border); border-radius: 14px; padding: 1rem 1.1rem; background: var(--card); margin: 0; }
.v-box legend { font-weight: 700; font-size: .85rem; padding: 0 .4rem; color: var(--soft); }
.v-cover { display: flex; gap: 1rem; align-items: flex-start; flex-wrap: wrap; }
.v-cover img { width: 220px; aspect-ratio: 16/9; object-fit: cover; border-radius: 10px; border: 1px solid var(--border); }
.v-cover-fields { flex: 1; min-width: 240px; display: grid; gap: .6rem; }
.v-editor-bar { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; }
.v-check { display: flex !important; align-items: center; gap: .5rem; color: var(--text) !important; font-size: 1rem !important; }
.v-check input { width: 20px; height: 20px; accent-color: var(--accent); }
.v-preview { border: 1px solid var(--border); border-radius: 12px; padding: 1rem 1.5rem; background: var(--card); max-width: none; }
.v-warn { background: var(--warn-bg); border: 1px solid var(--clay); border-radius: 12px; padding: .8rem 1rem; font-size: .92rem; }
.v-warn ul { margin: .3rem 0 0; padding-left: 1.2rem; }
.v-pill { display: inline-block; font-size: .72rem; font-weight: 700; padding: .15rem .6rem; border-radius: 100px; border: 1px solid var(--border-h); white-space: nowrap; }
.v-pill--live { color: var(--ok); border-color: var(--ok); }
.v-pill--draft { color: var(--muted); }
.v-pill--todo { color: var(--clay); border-color: var(--clay); margin-left: .3rem; }
.v-bad { color: var(--danger) !important; font-weight: 700; }
@media (max-width: 760px) {
  .v-row3 { grid-template-columns: 1fr; }
  .v-table th:nth-child(2), .v-table td:nth-child(2), .v-table th:nth-child(4), .v-table td:nth-child(4) { display: none; }
  .v-user { display: none; }
  .v-filter { margin-left: 0; }
}
`;

export const APP_JS = `
const $ = (s) => document.querySelector(s);
const el = (tag, props = {}, ...kids) => {
  const e = Object.assign(document.createElement(tag), props);
  for (const k of kids) e.append(k);
  return e;
};
const encKey = (k) => k.split('/').map(encodeURIComponent).join('/');
const size = (n) => n < 1024 ? n + ' B' : n < 1048576 ? (n / 1024).toFixed(1) + ' KB' : n < 1073741824 ? (n / 1048576).toFixed(1) + ' MB' : (n / 1073741824).toFixed(2) + ' GB';
const date = (s) => new Date(s).toLocaleString('ro-RO', { dateStyle: 'medium', timeStyle: 'short' });
const base = (k) => k.replace(/\\/$/, '').split('/').pop();
const CATS = { 'afectiuni': 'Afecțiuni', 'venerologie': 'Venerologie', 'ingrediente': 'Ingrediente', 'protectie-solara': 'Protecție solară', 'rutine': 'Rutine', 'consultatii': 'Consultații' };

let me = { admin: false, sharing: false, publishing: false };
const prefix = () => location.hash.startsWith('#!') ? '' : decodeURIComponent(location.hash.replace(/^#\\/?/, ''));

async function api(path, opts = {}) {
  const res = await fetch(path, { credentials: 'same-origin', ...opts });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

// ─── Files ───────────────────────────────────────────────────────────
function crumbs(p) {
  const nav = $('#crumbs');
  nav.replaceChildren(el('a', { href: '#/', textContent: 'Fișiere' }));
  let acc = '';
  for (const part of p.split('/').filter(Boolean)) {
    acc += part + '/';
    nav.append(el('span', { textContent: '/' }), el('a', { href: '#/' + acc, textContent: part }));
  }
}
const actionBtn = (label, onClick, extra = '') => el('button', { type: 'button', className: 'v-btn v-btn--ghost v-btn--sm ' + extra, textContent: label, onclick: onClick });

async function load() {
  const p = prefix();
  crumbs(p);
  const rows = $('#rows');
  let data;
  try { data = await api('/vault/api/list?prefix=' + encodeURIComponent(p)); }
  catch (e) { rows.replaceChildren(el('tr', {}, el('td', { colSpan: 4, className: 'v-empty', textContent: e.message }))); return; }
  const out = [];
  if (p) {
    const up = p.split('/').filter(Boolean).slice(0, -1).join('/');
    out.push(el('tr', {}, el('td', { className: 'v-name', colSpan: 4 }, el('a', { href: '#/' + (up ? up + '/' : ''), textContent: '↩ ..' }))));
  }
  for (const f of data.folders) {
    const actions = el('div', { className: 'v-actions' });
    if (me.admin) actions.append(actionBtn('Șterge', () => remove(f, true), 'v-btn--danger'));
    out.push(el('tr', {},
      el('td', { className: 'v-name' }, el('span', { className: 'v-icon', textContent: '📁' }), el('a', { href: '#/' + f, textContent: base(f) })),
      el('td', { className: 'v-num', textContent: '—' }), el('td', { className: 'v-date', textContent: '' }), el('td', {}, actions)));
  }
  for (const f of data.files) {
    const isPage = f.key.endsWith('.md');
    const href = (isPage ? '/vault/p/' : '/vault/f/') + encKey(f.key);
    const actions = el('div', { className: 'v-actions' },
      el('a', { className: 'v-btn v-btn--ghost v-btn--sm', href: '/vault/f/' + encKey(f.key) + '?download', textContent: 'Descarcă' }));
    if (me.admin && me.sharing) actions.append(actionBtn('Partajează', () => openShare(f.key)));
    if (me.admin) actions.append(actionBtn('Șterge', () => remove(f.key, false), 'v-btn--danger'));
    out.push(el('tr', {},
      el('td', { className: 'v-name' }, el('span', { className: 'v-icon', textContent: isPage ? '📄' : '▫️' }),
        el('a', { href, target: isPage ? '' : '_blank', rel: 'noopener', textContent: base(f.key) })),
      el('td', { className: 'v-num', textContent: size(f.size) }),
      el('td', { className: 'v-date', textContent: date(f.uploaded) }),
      el('td', {}, actions)));
  }
  if (!data.folders.length && !data.files.length) out.push(el('tr', {}, el('td', { colSpan: 4, className: 'v-empty', textContent: me.admin ? 'Gol — încarcă ceva.' : 'Nimic aici încă.' })));
  rows.replaceChildren(...out);
}

async function remove(key, folder) {
  const msg = folder ? 'Ștergi dosarul „' + base(key) + '” și TOT ce conține?' : 'Ștergi „' + base(key) + '”?';
  if (!confirm(msg)) return;
  try { await api('/vault/api/files/' + encKey(key) + (folder && !key.endsWith('/') ? '/' : ''), { method: 'DELETE' }); }
  catch (e) { alert(e.message); }
  load();
}

function upload(file) {
  const key = prefix() + file.name;
  const row = el('div', { className: 'v-upload' }, el('span', { textContent: file.name }), el('span', { textContent: size(file.size) }), el('progress', { max: 100, value: 0 }));
  $('#uploads').append(row);
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', '/vault/api/files/' + encKey(key));
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) row.querySelector('progress').value = (e.loaded / e.total) * 100; };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) row.remove();
      else { row.classList.add('error'); row.children[1].textContent = (JSON.parse(xhr.responseText || '{}').error) || 'Eroare'; }
      resolve();
    };
    xhr.onerror = () => { row.classList.add('error'); row.children[1].textContent = 'Eroare de rețea'; resolve(); };
    xhr.send(file);
  });
}
async function uploadAll(files) { for (const f of files) await upload(f); load(); }

let shareKey = '';
function openShare(key) {
  shareKey = key;
  $('#shareName').textContent = key;
  $('#shareResult').hidden = true;
  $('#shareDialog').showModal();
}

async function init() {
  try { me = await api('/vault/api/me'); }
  catch { $('#rows').replaceChildren(el('tr', {}, el('td', { colSpan: 4, className: 'v-empty', textContent: 'Autentifică-te din nou.' }))); return; }
  $('#user').textContent = me.email + ' · ' + me.role;
  if (me.canWrite && !me.publishing) {
    $('#setupNote').textContent = 'Publicarea articolelor nu este încă activă: lipsește secretul GITHUB_TOKEN în setările Worker-ului. Vezi docs/VAULT.md.';
    $('#setupNote').hidden = false;
  }
  if (me.admin) {
    $('#adminBar').hidden = false;
    $('#fileInput').onchange = (e) => { uploadAll([...e.target.files]); e.target.value = ''; };
    $('#newFolder').onclick = async () => {
      const name = (prompt('Numele dosarului') || '').trim().replace(/\\//g, '-');
      if (!name) return;
      try { await api('/vault/api/files/' + encKey(prefix() + name) + '/', { method: 'PUT' }); } catch (e) { alert(e.message); }
      load();
    };
    let depth = 0;
    const drop = $('#drop');
    addEventListener('dragenter', (e) => { if (location.hash.startsWith('#!')) return; if (e.dataTransfer?.types.includes('Files')) { depth++; drop.hidden = false; } });
    addEventListener('dragleave', () => { if (--depth <= 0) { depth = 0; drop.hidden = true; } });
    addEventListener('dragover', (e) => e.preventDefault());
    addEventListener('drop', (e) => { e.preventDefault(); depth = 0; drop.hidden = true; if (location.hash.startsWith('#!')) return; if (e.dataTransfer?.files.length) uploadAll([...e.dataTransfer.files]); });

    $('#shareCreate').onclick = async () => {
      try {
        const r = await api('/vault/api/share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: shareKey, hours: Number($('#shareHours').value) }) });
        $('#shareUrl').value = r.url;
        $('#shareExpires').textContent = 'Expiră ' + date(r.expires);
        $('#shareResult').hidden = false;
        $('#shareUrl').select();
      } catch (e) { alert(e.message); }
    };
    $('#shareCopy').onclick = async () => {
      try { await navigator.clipboard.writeText($('#shareUrl').value); $('#shareCopy').textContent = 'Copiat'; setTimeout(() => $('#shareCopy').textContent = 'Copiază', 1500); }
      catch { $('#shareUrl').select(); }
    };
  }
  if (me.publishing) { $('#tabs').hidden = false; initEditor(); if (!location.hash) location.hash = '#!articles'; }
  addEventListener('hashchange', route);
  route();
}

// ─── Routing: #/folder/ = files, #!articles / #!new / #!edit/<slug> = articles ───
function route() {
  const h = location.hash;
  const articles = me.publishing && h.startsWith('#!');
  $('#filesView').hidden = articles;
  $('#articlesView').hidden = !articles;
  document.querySelectorAll('#tabs a').forEach(a => { if ((a.dataset.tab === 'articles') === articles) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  if (!articles) return load();
  if (h === '#!new') return openEditor(null);
  if (h.startsWith('#!edit/')) return openEditor(decodeURIComponent(h.slice(7)));
  return loadPosts();
}

// ─── Articles ────────────────────────────────────────────────────────
let current = null; // { slug, sha, draft } of the article being edited
let slugTouched = false;
let allPosts = [];
const RO = { 'ș': 's', 'ş': 's', 'ț': 't', 'ţ': 't', 'ă': 'a', 'â': 'a', 'î': 'i', 'Ș': 's', 'Ş': 's', 'Ț': 't', 'Ţ': 't', 'Ă': 'a', 'Â': 'a', 'Î': 'i' };
const slugify = (t) => t.replace(/[șşțţăâîȘŞȚŢĂÂÎ]/g, c => RO[c]).toLowerCase().normalize('NFKD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
const today = () => new Date().toISOString().slice(0, 10);

function renderPosts() {
  const f = $('#postFilter').value;
  const list = allPosts.filter(p => f === 'all' || (f === 'draft') === p.draft);
  const rows = $('#postRows');
  if (!list.length) return rows.replaceChildren(el('tr', {}, el('td', { colSpan: 5, className: 'v-empty', textContent: 'Niciun articol.' })));
  rows.replaceChildren(...list.map(p => el('tr', {},
    el('td', { className: 'v-name' }, el('a', { href: '#!edit/' + encodeURIComponent(p.slug), textContent: p.title || p.slug })),
    el('td', { className: 'v-date', textContent: CATS[p.category] || '—' }),
    el('td', {}, el('span', { className: 'v-pill ' + (p.draft ? 'v-pill--draft' : 'v-pill--live'), textContent: p.draft ? 'Ciornă' : 'Publicat' }),
      ...(p.todo ? [el('span', { className: 'v-pill v-pill--todo', textContent: 'TODO', title: 'Conține note [TODO] de completat' })] : [])),
    el('td', { className: 'v-date', textContent: p.pubDate }),
    el('td', {}, el('div', { className: 'v-actions' },
      el('a', { className: 'v-btn v-btn--ghost v-btn--sm', href: '#!edit/' + encodeURIComponent(p.slug), textContent: 'Editează' }),
      ...(p.draft ? [] : [el('a', { className: 'v-btn v-btn--ghost v-btn--sm', href: '/blog/' + p.slug + '/', target: '_blank', rel: 'noopener', textContent: 'Vezi ↗' })]))))));
}

async function loadPosts() {
  $('#articleList').hidden = false; $('#editor').hidden = true;
  try { allPosts = (await api('/vault/api/posts')).posts; renderPosts(); }
  catch (e) { $('#postRows').replaceChildren(el('tr', {}, el('td', { colSpan: 5, className: 'v-empty', textContent: e.message }))); }
}

// FAQ / sources <-> simple text formats
const faqToText = (faq) => (faq || []).map(f => 'Î: ' + f.q + '\\nR: ' + f.a).join('\\n\\n');
function textToFaq(t) {
  const out = [];
  for (const block of t.split(/\\n\\s*\\n/)) {
    const q = block.match(/^\\s*[ÎI]:\\s*([\\s\\S]*?)(?=\\n\\s*R:|$)/i)?.[1]?.trim();
    const a = block.match(/\\n\\s*R:\\s*([\\s\\S]*)$/i)?.[1]?.trim();
    if (q || a) out.push({ q: q || '', a: (a || '').replace(/\\s*\\n\\s*/g, ' ') });
  }
  return out;
}
const sourcesToText = (src) => (src || []).map(s => [s.title, s.publisher || '', s.url || ''].join(' | ').replace(/( \\| )+$/, '')).join('\\n');
const textToSources = (t) => t.split('\\n').map(l => l.trim()).filter(Boolean).map(l => {
  const parts = l.split('|').map(x => x.trim());
  const url = parts.find(x => /^https?:\\/\\//.test(x)) || '';
  const rest = parts.filter(x => x !== url);
  return { title: rest[0] || '', ...(rest[1] ? { publisher: rest[1] } : {}), ...(url ? { url } : {}) };
});

let cover = '';
function setCover(url) {
  cover = url || '';
  $('#coverPreview').hidden = !cover; if (cover) $('#coverPreview').src = cover;
  $('#coverRemove').hidden = !cover;
}

function fill(p) {
  $('#fTitle').value = p.title || '';
  $('#fSlug').value = p.slug || '';
  $('#fDesc').value = p.description || '';
  $('#fCategory').value = p.category || '';
  $('#fTags').value = (p.tags || []).join(', ');
  $('#fDate').value = p.pubDate || today();
  $('#fDraft').checked = p.draft !== false;
  $('#fBody').value = p.body || '';
  $('#fFaq').value = faqToText(p.faq);
  $('#fSources').value = sourcesToText(p.sources);
  $('#fCoverAlt').value = p.imageAlt || '';
  setCover(p.image);
  $('#fSlug').readOnly = !!current;
  $('#deleteBtn').hidden = !current || !me.admin;
  $('#editorTitle').textContent = current ? 'Editează articolul' : 'Articol nou';
  $('#previewPane').hidden = true; $('#fBody').hidden = false; $('#previewBtn').textContent = 'Previzualizare';
  $('#saveStatus').textContent = '';
  sync();
}

async function openEditor(slug) {
  $('#articleList').hidden = true; $('#editor').hidden = false;
  current = null; slugTouched = false;
  if (!slug) return fill({});
  $('#saveStatus').textContent = 'Se încarcă…';
  try {
    const p = await api('/vault/api/posts/' + encodeURIComponent(slug));
    current = { slug: p.slug, sha: p.sha, draft: p.draft };
    slugTouched = true;
    fill(p);
  } catch (e) { $('#saveStatus').textContent = e.message; }
}

// Same list as worker/posts.ts — warnings only, the doctor decides
const CLAIMS = [[/vindec[ăa]/i, '„vindecă”'], [/elimin[ăa] definitiv/i, '„elimină definitiv”'], [/dermatologic garantat|garantat dermatologic/i, '„dermatologic garantat”'],
  [/100\\s*%\\s*natural/i, '„100% natural”'], [/f[ăa]r[ăa] (nicio )?chimicale/i, '„fără chimicale”'], [/rezultate garantate|garantat[ăe]? rezultat/i, '„rezultate garantate”'],
  [/\\bminune\\b|miraculos/i, '„minune / miraculos”']];
function problems() {
  const text = [$('#fTitle').value, $('#fDesc').value, $('#fBody').value, $('#fFaq').value].join('\\n');
  const todo = (text.match(/\\[TODO/g) || []).length;
  const claims = CLAIMS.filter(([re]) => re.test(text)).map(([, l]) => l);
  return { todo, claims };
}
function showWarnings() {
  const { todo, claims } = problems();
  const box = $('#warnings');
  const items = [];
  if (todo) items.push(el('li', { textContent: todo + (todo === 1 ? ' notă [TODO] de completat sau șters' : ' note [TODO] de completat sau șters') + ' — articolul nu poate fi publicat până atunci.' }));
  if (claims.length) items.push(el('li', { textContent: 'Formulări de evitat pentru produse cosmetice (Reg. UE 1223/2009 și 655/2013): ' + claims.join(', ') + '. Sunt în regulă doar când descrii un tratament medical.' }));
  box.hidden = !items.length;
  box.replaceChildren(...(items.length ? [el('strong', { textContent: 'De verificat:' }), el('ul', {}, ...items)] : []));
}

function sync() {
  const n = $('#fDesc').value.trim().length;
  $('#descCount').textContent = n;
  $('#descCount').classList.toggle('v-bad', n < 50 || n > 170);
  const t = $('#fTitle').value.trim().length;
  $('#titleCount').textContent = t;
  $('#titleCount').classList.toggle('v-bad', t > 70);
  $('#slugPreview').textContent = $('#fSlug').value || '…';
  $('#saveBtn').textContent = $('#fDraft').checked ? 'Salvează ciorna' : (current && !current.draft ? 'Actualizează articolul publicat' : 'Publică');
  showWarnings();
}

// Images: resized to max 1600 px and converted to WebP in the browser; the size goes in the file name
// ("-1600x900.webp") so the site can set width/height and avoid layout shift.
async function optimise(file) {
  if (file.type === 'image/gif') return file;
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = url; });
    const scale = Math.min(1, 1600 / img.naturalWidth);
    const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
    const canvas = Object.assign(document.createElement('canvas'), { width: w, height: h });
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    const blob = await new Promise(ok => canvas.toBlob(ok, 'image/webp', 0.82));
    const name = file.name.replace(/\\.[^.]+$/, '');
    if (blob && blob.type === 'image/webp') return new File([blob], name + '-' + w + 'x' + h + '.webp', { type: 'image/webp' });
    const jpg = await new Promise(ok => canvas.toBlob(ok, 'image/jpeg', 0.85));
    return new File([jpg], name + '-' + w + 'x' + h + '.jpg', { type: 'image/jpeg' });
  } finally { URL.revokeObjectURL(url); }
}
async function uploadImage(file) {
  const slug = $('#fSlug').value || 'nesortat';
  const ready = await optimise(file);
  const res = await fetch('/vault/api/media/' + encodeURIComponent(slug) + '/' + encodeURIComponent(ready.name), { method: 'PUT', headers: { 'Content-Type': ready.type }, body: ready });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || res.statusText);
  return { url: data.url, size: ready.size };
}

function initEditor() {
  $('#postFilter').onchange = renderPosts;
  $('#fTitle').addEventListener('input', () => { if (!slugTouched && !current) $('#fSlug').value = slugify($('#fTitle').value); sync(); });
  $('#fSlug').addEventListener('input', () => { slugTouched = true; $('#fSlug').value = slugify($('#fSlug').value).slice(0, 90) || $('#fSlug').value.toLowerCase(); sync(); });
  ['#fDesc', '#fBody', '#fFaq'].forEach(s => $(s).addEventListener('input', sync));
  $('#fDraft').addEventListener('change', () => {
    if (!$('#fDraft').checked && (!current || current.draft) && $('#fDate').value > today()) $('#fDate').value = today();
    sync();
  });

  $('#previewBtn').onclick = async () => {
    const showing = !$('#previewPane').hidden;
    if (showing) { $('#previewPane').hidden = true; $('#fBody').hidden = false; $('#previewBtn').textContent = 'Previzualizare'; return; }
    try {
      const { html } = await api('/vault/api/preview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body: $('#fBody').value }) });
      // Rendered by our own server from your own text; the vault CSP blocks any script in it
      $('#previewPane').innerHTML = '<h1>' + $('#fTitle').value.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])) + '</h1>' + html;
      $('#previewPane').hidden = false; $('#fBody').hidden = true; $('#previewBtn').textContent = 'Înapoi la editare';
    } catch (e) { alert(e.message); }
  };

  $('#fImage').onchange = async (e) => {
    const file = e.target.files[0]; e.target.value = '';
    if (!file) return;
    $('#saveStatus').textContent = 'Se optimizează și se încarcă imaginea…';
    try {
      const up = await uploadImage(file);
      const alt = prompt('Descrie imaginea în câteva cuvinte (pentru accesibilitate și Google):', file.name.replace(/\\.[^.]+$/, '').replace(/[-_]+/g, ' ')) || '';
      const ta = $('#fBody'); const at = ta.selectionStart ?? ta.value.length;
      const md = '\\n![' + alt.replace(/[\\[\\]]/g, '') + '](' + up.url + ')\\n';
      ta.value = ta.value.slice(0, at) + md + ta.value.slice(at);
      $('#saveStatus').textContent = 'Imagine adăugată (' + size(up.size) + ').';
    } catch (err) { $('#saveStatus').textContent = err.message; }
  };

  $('#fCover').onchange = async (e) => {
    const file = e.target.files[0]; e.target.value = '';
    if (!file) return;
    $('#saveStatus').textContent = 'Se încarcă imaginea principală…';
    try { const up = await uploadImage(file); setCover(up.url); $('#saveStatus').textContent = 'Imagine principală adăugată (' + size(up.size) + ').'; }
    catch (err) { $('#saveStatus').textContent = err.message; }
  };
  $('#coverRemove').onclick = () => setCover('');

  $('#editor').onsubmit = async (e) => {
    e.preventDefault();
    const slug = $('#fSlug').value.trim();
    const publishing = !$('#fDraft').checked;
    const { todo, claims } = problems();
    if (publishing && todo) { $('#saveStatus').textContent = 'Articolul mai conține note [TODO]. Completează-le sau șterge-le înainte de publicare.'; return; }
    if (publishing && claims.length && !confirm('Textul conține formulări de evitat pentru produse cosmetice: ' + claims.join(', ') + '.\\n\\nPublici oricum?')) return;
    if (cover && !$('#fCoverAlt').value.trim()) { $('#saveStatus').textContent = 'Adaugă descrierea imaginii principale.'; return; }
    const body = {
      title: $('#fTitle').value, description: $('#fDesc').value, category: $('#fCategory').value,
      tags: $('#fTags').value.split(',').map(t => t.trim()).filter(Boolean),
      pubDate: $('#fDate').value, draft: !publishing, body: $('#fBody').value,
      faq: textToFaq($('#fFaq').value), sources: textToSources($('#fSources').value),
      ...(cover ? { image: cover, imageAlt: $('#fCoverAlt').value } : {}),
      ...(current ? { sha: current.sha } : {}),
    };
    $('#saveBtn').disabled = true; $('#saveStatus').textContent = 'Se salvează…';
    try {
      const r = await api('/vault/api/posts/' + encodeURIComponent(slug), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      current = { slug, sha: r.sha, draft: r.draft };
      if (r.pubDate) $('#fDate').value = r.pubDate;
      $('#fSlug').readOnly = true; $('#deleteBtn').hidden = !me.admin; $('#editorTitle').textContent = 'Editează articolul';
      if (location.hash !== '#!edit/' + encodeURIComponent(slug)) history.replaceState(null, '', '#!edit/' + encodeURIComponent(slug));
      sync();
      if (r.draft) $('#saveStatus').textContent = 'Ciornă salvată (nu apare pe site).';
      else waitUntilLive(slug, r.commitSha);
    } catch (err) {
      $('#saveStatus').textContent = err.message;
    } finally { $('#saveBtn').disabled = false; }
  };

  // After publishing: poll /version.json until the site runs the commit we just made
  let waitToken = 0;
  async function waitUntilLive(slug, commitSha) {
    const mine = ++waitToken;
    const status = $('#saveStatus');
    const started = Date.now();
    status.replaceChildren('Salvat ✓ — site-ul se actualizează (de obicei 1–2 minute)…');
    while (mine === waitToken && Date.now() - started < 6 * 60 * 1000) {
      await new Promise(r => setTimeout(r, 8000));
      try {
        const v = await fetch('/version.json?t=' + Date.now(), { cache: 'no-store' }).then(res => res.json());
        if (commitSha && v.commit === commitSha) {
          status.replaceChildren('Live acum ✓ ', el('a', { href: '/blog/' + slug + '/', target: '_blank', rel: 'noopener', textContent: 'Vezi articolul ↗' }));
          return;
        }
      } catch { /* keep waiting */ }
      const s = Math.round((Date.now() - started) / 1000);
      status.replaceChildren('Salvat ✓ — site-ul se actualizează… (' + s + ' s)');
    }
    if (mine === waitToken) status.replaceChildren('Salvat ✓ — ar trebui să fie deja online: ', el('a', { href: '/blog/' + slug + '/', target: '_blank', rel: 'noopener', textContent: 'Vezi articolul ↗' }));
  }

  $('#deleteBtn').onclick = async () => {
    if (!current || !confirm('Ștergi definitiv „' + $('#fTitle').value + '”? (Rămâne în istoricul Git.)')) return;
    try {
      await api('/vault/api/posts/' + encodeURIComponent(current.slug) + '?sha=' + encodeURIComponent(current.sha), { method: 'DELETE' });
      location.hash = '#!articles';
    } catch (err) { $('#saveStatus').textContent = err.message; }
  };
}
init();
`;
