// Dr. Mădălina Iulia Lincu — professional profile. Source: "Sinopsis_variantaextinsa.docx" provided by
// the doctor (October 2026). Only facts from that document; edit here when something changes.

export const EDUCATION = {
  university: {
    ro: 'Facultatea de Medicină Generală, Universitatea de Medicină și Farmacie „Carol Davila” din București',
    en: 'Faculty of General Medicine, “Carol Davila” University of Medicine and Pharmacy, Bucharest',
    short: 'UMF „Carol Davila” București',
    year: 2020,
  },
  residency: {
    ro: 'Rezidențiat în dermatovenerologie la Spitalul Clinic Universitar de Urgență „Elias”, București',
    en: 'Residency in dermatology and venereology at “Elias” University Emergency Hospital, Bucharest',
    short: 'Spitalul Clinic Universitar de Urgență „Elias”',
  },
};

export const MEMBERSHIPS = [
  { name: 'Societatea Română de Dermatologie', short: 'SRD', en: 'Romanian Society of Dermatology' },
  { name: 'European Academy of Dermatology and Venereology', short: 'EADV', en: 'European Academy of Dermatology and Venereology' },
  { name: 'International Dermoscopy Society', short: 'IDS', en: 'International Dermoscopy Society' },
];

export const BIO = {
  ro: [
    'Dr. Mădălina Lincu este medic specialist dermatovenerolog, absolventă a Facultății de Medicină Generală din cadrul Universității de Medicină și Farmacie „Carol Davila” din București, promoția 2020.',
    'Și-a desfășurat programul de rezidențiat în dermatovenerologie în cadrul Spitalului Clinic Universitar de Urgență „Elias” din București, activând totodată și în cadrul Dr. Leventer Centre, unde s-a perfecționat în dermatologie clinică, chirurgie dermatologică și proceduri estetice avansate.',
    'Formarea sa profesională include stagii internaționale la Spitalul Universitar din Gent, Belgia, unde s-a specializat în dermatopatologie, precum și la CHU Saint-Pierre din Bruxelles, unde s-a perfecționat în onicologie.',
    'Este membru activ al Societății Române de Dermatologie (SRD), al Academiei Europene de Dermatologie și Venerologie (EADV) și al Societății Internaționale de Dermatoscopie (IDS).',
  ],
  en: [
    'Dr. Mădălina Lincu is a specialist in dermatology and venereology. She graduated from the Faculty of General Medicine of the “Carol Davila” University of Medicine and Pharmacy in Bucharest in 2020.',
    'She completed her residency in dermatology and venereology at the “Elias” University Emergency Hospital in Bucharest, while also working at the Dr. Leventer Centre, where she trained in clinical dermatology, dermatologic surgery and advanced aesthetic procedures.',
    'Her training includes international placements at Ghent University Hospital, Belgium (dermatopathology) and CHU Saint-Pierre, Brussels (onychology).',
    'She is an active member of the Romanian Society of Dermatology (SRD), the European Academy of Dermatology and Venereology (EADV) and the International Dermoscopy Society (IDS).',
  ],
};

export const STATEMENT = {
  ro: 'Parcursul meu în dermatologie este animat de pasiunea pentru îngrijirea pacienților, managementul clinic și cercetarea din acest domeniu complex, alături de un interes constant pentru dermatologia estetică și posibilitățile sale de a reda pacienților încrederea în propria imagine. Sunt recunoscătoare mentorei mele, Dr. Mihaela Leventer, pentru încurajarea constantă de a-mi aprofunda experiența clinică, și rămân dedicată dezvoltării continue a competențelor mele, atât în dermatologia medicală, cât și în cea estetică, în beneficiul celor pe care îi îngrijesc.',
  en: 'My path in dermatology is driven by a passion for patient care, clinical management and research in this complex field, together with a constant interest in aesthetic dermatology and its power to give patients back confidence in their own image. I am grateful to my mentor, Dr. Mihaela Leventer, for her constant encouragement to deepen my clinical experience, and I remain committed to developing my skills in both medical and aesthetic dermatology, for the benefit of those I care for.',
};

export interface Course { title: string; detail?: { ro: string; en: string }; place: string; date: string }
export interface CourseGroup { ro: string; en: string; courses: Course[] }

export const COURSES: CourseGroup[] = [
  {
    ro: 'Dermatologie oncologică și chirurgie dermatologică', en: 'Dermato-oncology and dermatologic surgery',
    courses: [
      { title: 'Mohs Micrographic Surgery in Skin Tumours', detail: { ro: 'tehnici de laborator, mapping tumoral, inking, secționare la criostat', en: 'laboratory techniques, tumour mapping, inking, cryostat sectioning' }, place: 'București, România', date: 'iunie 2024' },
      { title: 'Mohs Micrographic Surgery, a Tool in Skin Cancer Treatment', detail: { ro: 'management oncologic, analiză histopatologică, chirurgie reconstructivă', en: 'oncological management, histopathology, reconstructive surgery' }, place: 'București, România', date: 'iunie 2026' },
      { title: 'Workshop „Surgery – beginners and advanced”', place: 'Milano, Italia', date: 'septembrie 2022' },
      { title: 'Workshop „Suturi în chirurgia dermatologică”', place: 'București, România', date: 'septembrie 2022 și martie 2025' },
    ],
  },
  {
    ro: 'Dermatopatologie', en: 'Dermatopathology',
    courses: [
      { title: 'Summer Workshop: Dermatopathology', detail: { ro: 'corelație clinico-patologică, dermatopatologie moleculară, microscopie', en: 'clinicopathological correlation, molecular dermatopathology, microscopy' }, place: 'Gent, Belgia', date: 'august 2023' },
    ],
  },
  {
    ro: 'Dermatologie estetică și tehnologii laser', en: 'Aesthetic dermatology and laser technologies',
    courses: [
      { title: 'Curs Laser CO2, sub îndrumarea Dr. Alina Frățilă', detail: { ro: 'terapii laser ablative și fracționate, rejuvenare facială, tratamentul cicatricilor și vergeturilor', en: 'ablative and fractional laser therapy, facial rejuvenation, scars and stretch marks' }, place: 'Fundația pentru Sănătatea Pielii – Dr. Leventer Centre, București', date: 'iunie 2026' },
      { title: 'Chemical Peeling Masterclass, sub îndrumarea Prof. Marina Landau și Prof. Fotini Bageorgou', place: 'București, România', date: 'aprilie 2024' },
      { title: 'Curs de estetică injectabilă, sub îndrumarea Prof. Dr. Mihaela Leventer și Dr. Lara Mahoud', place: 'București, România', date: '2025' },
    ],
  },
  {
    ro: 'Fotobiologie și onco-dermatologie preventivă', en: 'Photobiology and preventive dermato-oncology',
    courses: [
      { title: 'Masterclass Photobiology', detail: { ro: 'fotoprotecție, fotodermatoze, fotocarcinogeneză, fototerapie', en: 'photoprotection, photodermatoses, photocarcinogenesis, phototherapy' }, place: 'Sevilia, Spania', date: 'mai 2023' },
      { title: 'Mature Skin – Specialist Course', detail: { ro: 'managementul pacientului vârstnic, imunosenescență, dispozitive bazate pe energie', en: 'care of the older patient, immunosenescence, energy-based devices' }, place: 'București, România', date: 'iunie 2026' },
    ],
  },
  {
    ro: 'Onicologie', en: 'Onychology',
    courses: [
      { title: 'The Onychology Course – English Session', detail: { ro: 'chirurgie unghială, recoltare micologică', en: 'nail surgery, mycological sampling' }, place: 'Bruxelles, Belgia', date: 'octombrie 2024' },
    ],
  },
  {
    ro: 'Parazitologie dermatologică', en: 'Parasitological dermatology',
    courses: [
      { title: 'Parasitologic Dermatology', detail: { ro: 'diagnostic parazitologic, infecții cutanate tropicale, sănătate publică', en: 'parasitological diagnosis, tropical skin infections, public health' }, place: 'Anvers, Belgia', date: 'septembrie 2025' },
    ],
  },
];

export const SOCIAL = {
  ro: 'Dincolo de practica clinică și dezvoltarea academică, Dr. Mădălina-Iulia Lincu se implică activ în proiecte de responsabilitate socială, contribuind la creșterea gradului de conștientizare privind sănătatea pielii și la asigurarea accesului la servicii medicale. Ca redactor medical, scrie texte educaționale destinate publicului larg și participă la campanii de sănătate și dermatologie, atât online, cât și offline, ajutând pacienții să înțeleagă mai bine afecțiunile lor și modul de gestionare a acestora. De asemenea, oferă voluntar consultații în cadrul unei campanii derulate în zone rurale izolate ale țării, unde dermatoscopia se dovedește un instrument esențial în depistarea precoce a cancerelor de piele.',
  en: 'Beyond clinical practice and academic development, Dr. Lincu is actively involved in social responsibility projects that raise awareness of skin health and improve access to care. As a medical writer she creates educational texts for the general public and takes part in health and dermatology campaigns, online and offline. She also volunteers consultations in a campaign in isolated rural areas of Romania, where dermoscopy is an essential tool for the early detection of skin cancer.',
};

// Personal essay (Romanian only), with the quote the doctor asked to accompany it
export const ESSAY = {
  title: 'De ce am ales dermatologia?',
  paragraphs: [
    'Fiecare dintre noi, la intrarea în facultatea de medicină, are o percepție despre medicină și despre cum este să fii medic. Viziunea mea despre această profesie a fost influențată parțial de eroii noștri personali, de propriile experiențe din domeniul sănătății și de versiunea dramatizată a serialelor Grey’s Anatomy sau Dr. House. Ca o mică mărturisire, percepția mea a fost puternic influențată de lista de lecturi din liceu și de așa-zisul statut al medicului în societate.',
    'În timpul anilor de studenție, m-am simțit trădată de neclaritatea și jocul de probabilități care fac parte din practica medicală de zi cu zi. Mi-am dat seama că tratamentul leucemiilor sau al insuficienței cardiace părea un deziderat suprarealist și nu mi-a plăcut să administrez tratamente bazate pe scoruri și probabilități. Treptat, m-am simțit atrasă de un domeniu cerebral și eminamente vizual, care are rezultate tangibile, iar în această căutare am dat peste dermatologie.',
    'Dermatologia este ceea ce mi-am imaginat că va fi medicina. Suntem capabili să diagnosticăm vizual, să confirmăm cu o biopsie, să vedem împreună cu pacientul cum leziunile se ameliorează. Ideea de medicină nu înseamnă să urmăresc doar un număr sau un interval de referință, iar în multe cazuri efectul placebo joacă un rol important. Această combinație de corelație clinico-patologică ușor accesibilă și de gratificare imediată este unică în dermatologie. De asemenea, avem tratamente foarte bune pentru o multitudine de boli. Sigur, sunt implicate multe medicamente (corticosteroizi, antibiotice, imunomodulatoare etc.), dar răspunsul imediat la tratament este prețuit și admirat de pacienți.',
    'Dacă varietatea este condimentul vieții, atunci dermatologia îl are din plin. Văd pacienți de toate vârstele și sexele. În plus, am ocazia să fac mici proceduri de chirurgie oncologică și plastică, precum și puțină chirurgie estetică. Pacienții au nevoie de la sfaturi de îngrijire a pielii până la tratamente complexe de dermatologie medicală, chiar pe secția de terapie intensivă. Populația noastră diversă de pacienți ne oferă o multitudine de boli interesante. Nu toți dermatologii aleg să trateze toată gama de afecțiuni dermatologice, fiecare dintre noi având libertatea de a alege doar o anumită parte a dermatologiei.',
    'Sunt convinsă că acesta este motivul pentru care dermatologii sunt cei mai fericiți, cei mai mulțumiți, cei mai în formă și cei mai predispuși să aleagă din nou aceeași profesie. Cireașa de pe tort sunt orele de lucru prietenoase cu familia și faptul că suntem bine recompensați pentru expertiza noastră. De aici se explică și faptul că dermatologia este una dintre cele mai competitive specialități din medicină, atât în America, cât și în Europa.',
  ],
  quote: 'Împrietenirea cu propriii demoni și cu nesiguranța pe care o aduc ei are drept efect o relaxare, o bucurie foarte simplă și prea puțin evidentă.',
};

// Areas of interest (for JSON-LD knowsAbout and the AI summary) — taken from the training above
export const AREAS = ['Dermatologie clinică', 'Dermatoscopie', 'Dermatologie oncologică', 'Chirurgie dermatologică',
  'Chirurgie Mohs', 'Dermatopatologie', 'Onicologie', 'Fotobiologie', 'Dermatologie estetică', 'Laser CO2',
  'Peeling chimic', 'Estetică injectabilă', 'Parazitologie dermatologică'];
