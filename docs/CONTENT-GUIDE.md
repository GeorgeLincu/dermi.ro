# Content guide (dermi.ro articles)

Rules for everyone (people and AI) who writes articles for dermi.ro. The site belongs to
**Dr. Mădălina Iulia Lincu, medic specialist Dermatovenerologie**. Articles are written in
**Romanian** with correct diacritics (ș ț with comma below, ă â î).

**The authoritative editorial prompt is [`PROMPT-ARTICOLE.txt`](PROMPT-ARTICOLE.txt)** (written by the owners,
Romanian): AIDA adapted ethically for medicine, title rules, CTA rules, sources (AAD first), final control.
This guide adds the site-specific details. Since 2026-11-17 all articles follow it (rewrite after readers said
the old texts "read like AI").

Check any article with `npm run check:articles [-- <slug>]` (frontmatter, length, internal links, CTA, doctor's note,
phrases to avoid, "tu" forms).

## File and frontmatter

One file per article: `src/content/blog/<slug>.md`. The slug is lowercase ASCII with hyphens
(ș→s, ț→t, ă→a, â→a, î→i). The URL becomes `https://dermi.ro/blog/<slug>/`. Never rename a published slug.

```yaml
---
title: "Acneea la adulți: de ce apare și ce opțiuni de tratament există"   # 10–110 chars, aim 45–70
description: "…"            # 50–170 characters, unique, „dumneavoastră” form
pubDate: 2026-10-01
category: "afectiuni"       # afectiuni | estetica | ingrediente | protectie-solara | rutine | consultatii
tags: ["acnee", "adulți"]   # 2–5 lowercase Romanian tags
draft: true                 # AI-written or unreviewed => always true. Only the doctor publishes.
faq:                        # 3–5 questions people really search for; answers 1–3 sentences
  - q: "…"
    a: "…"
sources:                    # 3–6 sources actually consulted
  - title: "Exact page title"
    publisher: "American Academy of Dermatology (accesat 17.11.2026)"
    url: "https://…"        # only URLs that were opened and exist
---
```
All strings in double quotes; inside text use Romanian quotes „…”.

## Structure

1. **Attention**: a concrete, recognisable situation or common confusion, then the direct answer to the title
   (Google and AI assistants quote the opening). Never assume the reader has the condition.
2. Optional `## Pe scurt` (3–5 bullets) — only where it really helps; not in every article.
3. **Interest**: `##` / `###` sections with natural, varied headings: what is known, what cannot be concluded
   without an examination, factors, myths, signs that justify an evaluation. Explain jargon at first use.
4. **Desire**: what correct information and an evaluation can realistically clarify, and their limits.
5. `## Când poate fi util un consult dermatologic?` — concrete, without diagnosing the reader. Always present.
6. A short closing paragraph with the main idea (no „În concluzie”).
7. **Action**: one calm CTA to a consultation with Dr. Mădălina Iulia Lincu, linking to
   **`[…](/program/)`** (schedule, locations, maps). When a direct booking link exists, replace `/program/` in all
   articles (`CONFIG.bookingUrl` in `src/config.ts` shows a booking button site-wide). No urgency, no pressure.
8. **Doctor's note, last**: `## [TODO: Notă pentru medic — ștergeți această secțiune înainte de publicare]` with the
   editorial objective, claims to confirm, missing information, unverifiable sources. Inline uncertain claims are
   marked `[TODO: de confirmat de medic — …]`. The site refuses to publish any text containing `[TODO`.
9. Internal links: 2–5 links `[text](/blog/<slug>/)` to slugs that exist (`npm run check:articles` verifies).
10. Do **not** put an FAQ, a disclaimer or a sources list in the body: the layout renders the frontmatter `faq`
    (with FAQPage JSON-LD), the sources and the disclaimer („Acest articol are scop informativ și nu înlocuiește
    consultația medicală…”).
11. Length: about 1,500–1,800 words.

## Voice and style (why the 2026-11 rewrite happened)

- Address the reader with **„dumneavoastră”** consistently (title, description, body, FAQ).
- Calm, competent, empathetic, non-judgemental; Romanian as a Romanian medical editor writes it, not translated.
- Vary sentence and paragraph length; prose first, lists only for list-like content; little bold.
- Avoid formulaic phrases: „Vestea bună este că”, „Este important de menționat”, „joacă un rol crucial”,
  „În concluzie”, „Nu în ultimul rând”, „În zilele noastre”, „secretul”, „tratament-minune”, „scăpați definitiv”.
  Em dashes sparingly. No reflexive triplets of adjectives.

## Medical and legal rules (non-negotiable)

- **Evidence-based** and conservative. Sources: AAD public pages first (https://www.aad.org/public/diseases), then
  guidelines and official sources (EuroGuiDerm/EDF, JAAD, BAD, NICE/CKS, NHS, DermNet, WHO, Cochrane). When
  evidence is weak or recommendations differ, say so. Never cite a source that was not actually consulted.
- **Never invent**: no testimonials, patient stories, case studies, "în practica mea…", invented statistics,
  before/after claims, credentials, or services the doctor offers. Unknown → `[TODO: de confirmat de medic — …]`.
- Prescription medicines: name the class/active substance, say they are prescribed and monitored by a doctor,
  **no doses**. Never suggest starting, stopping or changing a prescribed treatment without the doctor.
- **No brand or product names.**
- Cosmetics (EU Reg. 1223/2009 and 655/2013): no „vindecă”, „elimină definitiv”, „100% natural”,
  „dermatologic garantat” for cosmetics. Medical treatments may be described as treatments.
- Codul de deontologie medicală al CMR: informative, not promotional; no comparative advertising, no guarantees,
  no fear-mongering, no prices or offers.
- Romanian context only when certain (programmes, reimbursement, availability) — otherwise `[TODO]`.

## Aesthetic dermatology (category `estetica`)

- Informative: realistic expectations, candidates, contraindications, procedure, recovery, risks (including rare
  serious ones), duration of effect, how to choose a qualified doctor, red flags (non-medical settings, home devices).
- No prices, offers, before/after, "permanent" or "fără riscuri". The single CTA invites to an **evaluation**;
  never claim the doctor performs a procedure unless she confirmed it.
- Botulinum toxin is a prescription-only medicine: neutral description, never a brand, never advertised.

## Articles (slugs; categories in each file)

afectiuni: acneea-la-adulti, alunite-semne-de-alarma, caderea-parului-la-femei, cum-previi-petele-pigmentare,
cum-tratezi-rozaceea, dermatita-atopica, dermatita-seboreica, herpes-labial, hiperhidroza, keratoza-pilara,
melasma, micoza-unghiilor, mituri-despre-acnee, negii-veruci, psoriazis, urticaria, vitiligo, dermatita-perorala,
foliculita, dermatita-de-contact, eczema-mainilor, pielea-uscata-xeroza, hiperpigmentarea-postinflamatorie,
keratoza-actinica, moluscum-contagios, pitiriazis-versicolor, alopecia-areata, cheloizi-si-cicatrici-hipertrofice ·
estetica: cicatricile-post-acnee, fillerele-cu-acid-hialuronic, imbatranirea-pielii-ce-functioneaza,
laserul-in-dermatologia-estetica, microneedlingul, peelingul-chimic, plasma-bogata-in-trombocite-prp,
toxina-botulinica, cuperoza-si-vasele-vizibile, cearcanele, porii-dilatati ·
ingrediente: ghid-complet-despre-acid-hialuronic, acidul-azelaic, ceramidele-si-bariera-pielii, niacinamida,
retinolul-si-retinoizii, vitamina-c-in-skincare, acidul-salicilic, acizii-exfolianti-aha-bha-pha ·
protectie-solara: cum-aplici-corect-protectia-solara, protectia-solara-la-copii, spf-pe-scurt ·
rutine: cum-alegi-crema-hidratanta-potrivita, importanta-exfolierii, ingrijirea-pielii-iarna,
ingrijirea-pielii-in-sarcina, rutina-corecta-pentru-pielea-sensibila, rutina-de-ingrijire-de-baza,
top-5-greseli-in-ingrijirea-pielii, pielea-in-menopauza, ingrijirea-pielii-la-barbati, rutina-pentru-pielea-grasa ·
consultatii: cand-sa-mergi-la-dermatolog, dermatoscopia, autoexaminarea-pielii.

(The venereology topic was removed on 2026-10-01; its four drafts are in the Git history.)
