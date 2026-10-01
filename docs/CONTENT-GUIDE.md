# Content guide (dermi.ro articles)

Rules for everyone (people and AI) who writes articles for dermi.ro. The site belongs to
**Dr. Mădălina Iulia Lincu, medic specialist în Dermatovenerologie**. Articles are written in
**Romanian** with correct diacritics (ș ț with comma below, ă â î).

## File and frontmatter

One file per article: `src/content/blog/<slug>.md`. The slug is lowercase ASCII with hyphens
(ș→s, ț→t, ă→a, â→a, î→i). The URL becomes `https://dermi.ro/blog/<slug>/`.

```yaml
---
title: "Acneea la adulți: cauze, tratamente și când mergi la dermatolog"   # 40–65 characters ideally
description: "Ce declanșează acneea după 25 de ani, ce tratamente au dovezi și ce poți face acasă."  # 50–170 characters, unique
pubDate: 2026-10-01
category: afectiuni        # afectiuni | venerologie | ingrediente | protectie-solara | rutine | consultatii
tags: [acnee, adulți, tratament]   # 2–5 lowercase Romanian tags
draft: true                # AI-written or unreviewed => always true. Only the doctor publishes.
faq:                       # optional, 3–5 questions people really search for; answers 1–3 sentences
  - q: "Acneea la adulți trece singură?"
    a: "..."
sources:                   # 3–6 authoritative sources
  - title: "Guidelines of care for the management of acne vulgaris"
    publisher: "American Academy of Dermatology (JAAD, 2024)"
    url: "https://..."     # ONLY if you are certain the URL exists; otherwise leave url out
---
```

## Structure (optimised for Google, featured snippets and AI answers)

1. **First paragraph = the direct answer** (2–3 sentences) to the question in the title.
   AI agents and Google quote this. No fluff ("În zilele noastre…").
2. `## Pe scurt` — 3–5 bullet key takeaways.
3. Body with `##` / `###` headings phrased the way people search ("Ce este…", "Ce cauzează…",
   "Cum se tratează…", "Ce poți face acasă", "Mituri"). Short paragraphs, lists, one table where it
   genuinely helps (comparisons, routines).
4. `## Când să mergi la dermatolog` — concrete red flags. Always present.
5. Internal links: 2–5 links to related dermi.ro articles, as `[text](/blog/<slug>/)`, using only
   slugs from the article plan below.
6. Do **not** write an FAQ section in the body — FAQs go in frontmatter `faq` (rendered + FAQPage JSON-LD).
7. Do **not** add a disclaimer or sources list in the body — the layout renders both.
8. Length: 1,200–2,000 words for disease/ingredient guides, 900–1,400 for practical guides.

## Medical and legal rules (non-negotiable)

- **Evidence-based** and conservative: follow current guidelines (EADV/EDF/EuroGuiDerm, AAD/JAAD,
  BAD, NICE, Cochrane, WHO, CDC STI guidelines, IUSTI for STIs). When evidence is weak, say so.
- **Never invent**: no testimonials, patient stories, case studies, "my patients…", "in my practice
  I've seen…", invented statistics, before/after claims, or credentials. If a personal note from the
  doctor would help, write one line: `> [TODO: Dr. Mădălina — observație din practică, opțional]`.
- Statistics only when well established (e.g. prevalence from a guideline) and attributed in text
  ("potrivit OMS…"). Otherwise use qualitative wording.
- Prescription medicines: name the class/active substance, say they are prescribed and monitored by a
  doctor, **no doses**, no "buy this". Mention key safety points (e.g. isotretinoin and pregnancy,
  topical steroids not long-term unsupervised).
- **No brand or product names** (future affiliate content will be clearly labelled separately).
- Cosmetics (EU Reg. 1223/2009 and 655/2013): don't claim a cosmetic "vindecă", "tratează",
  "elimină definitiv", "100% natural fără chimicale", "dermatologic garantat". Medical treatments
  may of course be described as treatments.
- Romanian medical deontology (Codul de deontologie medicală al CMR): informative, not promotional;
  no comparative advertising, no guarantees of results, no fear-mongering.
- Romanian context where useful (e.g. "medicul de familie", "dermatolog"), but don't state local
  facts you are not sure about (programmes, prices, reimbursement). Use `[TODO: verifică]` instead.
- Tone: warm, clear, professional; address the reader as "tu"; explain jargon in plain words.
- Sources: real, authoritative, verifiable. If you are not sure a specific URL exists, give the title
  and publisher without `url`. Never fabricate a DOI or URL.

## Article plan (slugs reserved for internal linking)

Existing (migrated, rewritten as drafts): `cum-alegi-crema-hidratanta-potrivita`,
`cum-previi-petele-pigmentare`, `cum-tratezi-rozaceea`, `ghid-complet-despre-acid-hialuronic`,
`importanta-exfolierii`, `mituri-despre-acnee`, `rutina-corecta-pentru-pielea-sensibila`,
`spf-pe-scurt`, `top-5-greseli-in-ingrijirea-pielii`, (`bun-venit-dermi` is replaced by the About page).

New:
- afectiuni: `acneea-la-adulti`, `dermatita-atopica`, `psoriazis`, `dermatita-seboreica`, `melasma`,
  `alunite-semne-de-alarma`, `herpes-labial`, `micoza-unghiilor`, `urticaria`,
  `caderea-parului-la-femei`, `negii-veruci`, `hiperhidroza`, `keratoza-pilara`, `vitiligo`
- venerologie: `infectii-cu-transmitere-sexuala`, `hpv-si-condiloamele`, `herpesul-genital`, `sifilisul`
- ingrediente: `retinolul-si-retinoizii`, `niacinamida`, `vitamina-c-in-skincare`, `acidul-azelaic`,
  `ceramidele-si-bariera-pielii`
- protectie-solara: `cum-aplici-corect-protectia-solara`, `protectia-solara-la-copii`
- rutine: `rutina-de-ingrijire-de-baza`, `ingrijirea-pielii-in-sarcina`, `ingrijirea-pielii-iarna`
- consultatii: `cand-sa-mergi-la-dermatolog`, `dermatoscopia`
