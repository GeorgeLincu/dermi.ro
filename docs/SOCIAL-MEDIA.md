# Social media — dermi.ro (Facebook, Instagram, YouTube, TikTok)

Guide for AI assistants and future sessions. Human guide (Romanian): `docs/social-media.html`.
Brand kit: `brand/social/` (regenerate with `npm run social`, `--force` to re-render; script `scripts/social-assets.mjs`).
Decisions (2026-11-17): **organic only** (no ads, no tracking pixels on the site), **minimal doctor time**
(carousels and graphics first, one short filming session per month), posts in **Romanian**.

## Non-negotiable rules (same as the site — see CLAUDE.md and docs/CONTENT-GUIDE.md)

- Informative, never promotional (CMR deontology). No "best", no guaranteed results, no prices, no discounts.
- No testimonials, no patient stories, no patient before/after photos, no identifiable patients.
- No brand or product names, no prescription-drug doses, botulinum toxin is never promoted.
- Cosmetic claims follow EU rules (Reg. 1223/2009, 655/2013) — no "cures", "repairs DNA", "detox".
- Every medical statement comes from a **published** dermi.ro article (or a cited guideline) and is approved by
  Dr. Mădălina before posting. AI drafts mark anything unverified with `[TODO: verifică]`.
- No diagnosis or treatment advice in comments or DMs (reply template below). No health data collected in DMs.
- AI-generated images/video are labelled with the platform's AI label; the doctor's face and voice are never synthesised.
- Never invent facts about the doctor. Use only: Dr. Mădălina Iulia Lincu, medic specialist Dermatovenerologie,
  CMR code 2620033311, collaborator at Dr. Leventer Centre (Monetăriei 8 and Herăstrău 9, Bucharest), site dermi.ro.

## Workflow

1. Once a month George pastes the master prompt below (with the list of published articles) into Claude.
2. Claude returns the 4-week calendar and all copy/scripts. George designs posts in Canva from the templates in
   `brand/social/` (Canva Brand Kit: colours and fonts below).
3. Dr. Mădălina reviews every medical sentence (comments in the doc), records the month's 4–6 short clips in one
   ~60-minute session, using the scripts.
4. George schedules: Meta Business Suite (Facebook + Instagram), TikTok Studio (web), YouTube Studio.
5. First Monday of the month: KPI review prompt (below) with the numbers from each platform.

## Brand

| Element | Value |
|---|---|
| Colours | green `#2d5a4d`, clay `#9f4b2b`, cream `#f8f4ee`, ink `#1b2622`, soft ink `#4b5651`, blush `#f1d9ca`, peach `#e7b49b` |
| Fonts | Fraunces (headings, italic accents in green), Figtree (text) — both free on Google Fonts and in Canva |
| Logo | wordmark "der*mi*" (mi in green italic, clay dot); seal "mi" in a ring on green (`profile-1080.png`) |
| Voice | calm, clear, warm, evidence-based; "tu" form; short sentences; explains *why*; no fear-mongering, no slang overload, max 1–2 emoji |
| Tagline | „Pielea ta, explicată de un medic." |
| Disclaimer | „Informații generale, cu scop educativ. Nu înlocuiesc consultația medicală." |

## Platform specs (verify yearly — platforms change)

| Use | Size | Brand-kit file | Notes |
|---|---|---|---|
| Profile picture (all 4) | 1080×1080 | `profile-1080.png` | shown as a circle; FB ≥ 320, IG 320, YT 800, TikTok ≥ 200 |
| Facebook cover | 1640×624 | `facebook-cover-1640x624.png` | mobile crops the sides; keep text in the centre |
| YouTube banner | 2560×1440, ≤ 6 MB | `youtube-banner-2560x1440.png` | text inside the central 1546×423 |
| YouTube watermark | 150×150 rec., ≤ 1 MB | `youtube-watermark-600.png` | YouTube scales it down |
| YouTube thumbnail | 1280×720, ≤ 2 MB | `youtube-thumbnail-1280x720.png` | right side = doctor's photo |
| IG/FB carousel | 1080×1350 (4:5), up to 20 slides | `post-carousel-cover/slide/end-1080x1350.png` | IG grid previews a 3:4 crop — keep titles away from the edges |
| Square post | 1080×1080 | `post-myth-fact-1080x1080.png` | |
| Reels / TikTok / Shorts / Stories | 1080×1920 | `vertical-cover-1080x1920.png`, `vertical-safe-zones-1080x1920.png` | keep text out of top 250 px, bottom 420 px, right 160 px; Shorts ≤ 3 min |
| IG Story Highlights | 1080×1920 (shown as circle) | `highlight-*-1080x1920.png` | one per pillar |

Captions: IG ≤ 2,200 chars and 3–5 hashtags; TikTok ≤ 4,000 chars; YouTube title ≤ 100 chars (aim ≤ 60), description ≤ 5,000.
Links: Instagram/TikTok captions aren't clickable → "link în bio". Use UTM links:
`https://dermi.ro/blog/<slug>/?utm_source=<instagram|facebook|tiktok|youtube>&utm_medium=social&utm_campaign=<yyyy-mm>`.

## Master prompt (copy-paste; English instructions, Romanian output)

```text
You are a senior team working together for the professional social media of a Romanian dermatologist:
a social media strategist, a medical-content editor (dermatology), a native Romanian copywriter,
a short-form video producer, a community manager and a healthcare compliance reviewer (CMR deontology,
EU cosmetics claims rules, GDPR). Each role checks the others' work before you answer.

CONTEXT
- Account: dermi.ro — Dr. Mădălina Iulia Lincu, medic specialist Dermatovenerologie (CMR 2620033311),
  collaborator at Dr. Leventer Centre, Bucharest. Website with evidence-based articles: https://dermi.ro
- Channels: Instagram, Facebook, TikTok, YouTube (Shorts + optional monthly long video).
- Goal: trust and visibility; drive readers to dermi.ro articles and the newsletter (https://dermi.ro/newsletter/).
  Organic only, no ads. The doctor has little time: favour carousels and graphics; at most 6 short clips
  per month, all recordable in one 60-minute session, talking to camera, no props beyond a sunscreen tube
  or a generic jar without a visible brand.
- Audience: Romanian adults 22–55, mostly women, interested in skin health and skincare, confused by
  influencer advice; secondary: parents (children's eczema, sun protection).
- Brand voice: calm, clear, warm, evidence-based, "tu" form, short sentences, explain the "why",
  no fear-mongering, max 1–2 emoji per post. Tagline: "Pielea ta, explicată de un medic."
- Content pillars: (1) Mit vs. fapt, (2) Ingredientul lunii, (3) Rutina corectă,
  (4) Când mergi la dermatolog, (5) Sezonier / protecție solară.

SOURCE MATERIAL (only these — do not add medical facts that are not in them)
Month: {MONTH YYYY-MM}
Seasonal context / events: {e.g. "December: cold, dry skin, holidays"; World days if relevant}
Published articles (title — URL — full text or key points):
{PASTE HERE}

HARD RULES
- Informative, never promotional: no "best", no promises, no prices, no offers, no calls to book a treatment.
- No testimonials, patient stories or patient before/after photos; no brand or product names;
  no prescription-drug doses; never promote botulinum toxin; no "cure/repair/detox" cosmetic claims.
- Every medical statement must come from the source material. If you are not sure, write
  [TODO: verifică] next to it. Never invent statistics, studies or quotes.
- Each post ends with a clear, non-salesy CTA (read the article, save the post, subscribe to the newsletter)
  and, for medical topics, the line: "Informații generale; nu înlocuiesc consultația medicală."
- Images: describe only illustrations, textures, ingredients, hands, sunscreen, the doctor talking —
  no realistic skin disease photos generated by AI. Flag any AI-generated visual as "AI label: yes".
- Romanian with full diacritics (ă, â, î, ș, ț). Accessible language (reading age ~14).

DELIVERABLES
1. A 4-week calendar table: date, platform(s), pillar, format, title, source article, cross-posting.
   Cadence: Instagram + Facebook 3 posts/week (mostly carousels, 1 Reel); TikTok + YouTube Shorts
   1–2 videos/week (the same clips, re-cut); Stories 3×/week (polls, quizzes, "link to article");
   1 optional YouTube long video (6–10 min) built from one article.
2. For every carousel: hook on slide 1 (max 8 words), 5–8 slides with max 40 words each, end slide CTA,
   caption (≤ 1,200 chars, hook in the first 125 chars), 3–5 Romanian hashtags, alt text per slide,
   UTM link. Use the templates: cover / numbered slide / myth-fact / end slide.
3. For every video: 30–45 s script in spoken Romanian, with timecodes, on-screen text (≤ 7 words per
   card, inside the safe zone), b-roll ideas, cover title (3–6 words), caption, hashtags, and the
   YouTube Shorts title. A one-page "filming day" sheet listing all clips in recording order.
4. Stories: 12 ideas with stickers (poll, quiz, question box) — questions answered generally, never as
   individual diagnosis.
5. Community kit: 8 reply templates in Romanian (thanks; general question; personal medical question →
   "Nu putem oferi diagnostic online; te rugăm să te adresezi unui medic dermatolog"; booking question →
   neutral info about the clinic; misinformation; aggressive comment; product recommendation request;
   media/collaboration request).
6. A compliance table: every post × rule check (sources, no promotion, no brands, disclaimer, AI label,
   TODOs left) with ✅/⚠️.

FORMAT
Markdown, one section per deliverable, ready to paste into Canva and the schedulers. Ask me up to 3
questions first only if the source material is missing; otherwise produce everything in one answer.
```

## Follow-up prompts

- **Article → carousel:** "Using only this article: {URL + text}, write one 7-slide carousel (pillar: {X}) with
  hook, slides ≤ 40 words, end slide, caption, hashtags, alt texts and a 35-second Reel script. Same rules as before."
- **Filming day:** "Turn these {N} scripts into a filming sheet: order, outfit/background notes, each line
  split into ≤ 12-word sentences readable from a phone teleprompter, and 3 alternative hooks per clip."
- **Comment help:** "Draft a reply to this comment following the community kit: {comment}. If it asks for
  personal medical advice, use the no-diagnosis template."
- **Monthly review:** "Here are last month's numbers per post {table: reach, saves, shares, comments,
  profile visits, link clicks, follows}. Find the 3 best and 3 weakest posts, explain why, and adjust next
  month's mix (keep the rules and the doctor's time budget)."
- **YouTube long video:** "From article {URL}, write a 7–9 minute script: hook (15 s), chapters with
  timestamps, B-roll list, title options (≤ 60 chars), description with chapters + sources + disclaimer,
  pinned comment, thumbnail text (≤ 4 words)."

## Account set-up checklist (owner; details in docs/social-media.html)

- Same handle everywhere: `dermi.ro` (fallback `dr.madalinalincu`). Login e-mail: `social@dermi.ro`
  (Cloudflare Email Routing alias → drmadalinalincu@gmail.com; ROADMAP SM2).
- Facebook Page (category: Dermatologist / Medic) owned through a Meta Business portfolio; both George and the
  doctor have full control; Instagram professional (Creator) account linked to the Page.
- YouTube channel on a **Brand Account**, George as Manager; check eligibility for YouTube health-source
  information panels for licensed professionals.
- TikTok Business account (no ads).
- 2FA with an authenticator app on every account, recovery codes stored offline, passwords in a password
  manager, never shared — access is given through roles.
- After the accounts exist: add the profile URLs to `CONFIG.doctor.profiles` in `src/config.ts`
  (feeds JSON-LD `sameAs`) and social links in the footer (ROADMAP SM3). No CSP change is needed for plain links;
  **no embeds or pixels** (would need CSP, cookie banner and privacy-policy changes).
