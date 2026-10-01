// UI strings. Romanian is the main language (served at /), English lives under /en/.
export const languages = { ro: 'RO', en: 'EN' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'ro';

const ui = {
  ro: {
    'a11y.skip':     'Sari la conținut',
    'nav.home':      'Acasă',
    'nav.articles':  'Articole',
    'nav.topics':    'Teme',
    'nav.about':     'Despre',
    'nav.contact':   'Contact',
    'nav.menu':      'Meniu',
    'nav.book':      'Programează o consultație',
    'theme.toggle':  'Schimbă tema (luminoasă / întunecată)',
    'lang.label':    'Limba',

    'meta.title':       'Dermi — dermatologie explicată de un medic specialist',
    'meta.description': 'Articole clare, bazate pe dovezi, despre sănătatea pielii, părului și unghiilor, scrise de Dr. Mădălina Iulia Lincu, medic specialist dermatovenerolog.',

    'hero.kicker':   'Dermatologie · Estetică · Îngrijirea pielii',
    'hero.title1':   'Pielea ta,',
    'hero.title2':   'explicată de un medic.',
    'hero.lead':     'Informații clare și verificate despre afecțiunile pielii, ingrediente și rutine — ca să iei decizii bune și să știi când e momentul unei consultații.',
    'hero.cta':      'Citește articolele',
    'hero.cta2':     'Despre medic',

    'home.latest':     'Cele mai noi articole',
    'home.all':        'Toate articolele',
    'home.topics':     'Teme',
    'home.topicsLead': 'Ghiduri organizate pe teme, ca să găsești repede ce te interesează.',
    'home.empty':      'Primele articole sunt în pregătire. Revino în curând.',
    'home.principles': 'Cum scriem',
    'p1.title': 'Bazat pe dovezi',
    'p1.body':  'Pornim de la ghidurile societăților de dermatologie și de la studii solide, cu sursele la vedere.',
    'p2.title': 'Fără promisiuni false',
    'p2.body':  'Nu promitem rezultate și nu facem reclamă. Explicăm ce funcționează, ce nu și de ce.',
    'p3.title': 'Actualizat',
    'p3.body':  'Fiecare articol are data publicării și a ultimei revizuiri.',

    'author.label':   'Autor',
    'author.more':    'Despre autor',

    'blog.title':     'Articole',
    'blog.lead':      'Ghiduri despre sănătatea pielii, scrise pe înțelesul tuturor.',
    'blog.back':      '← Toate articolele',
    'blog.updated':   'Actualizat',
    'blog.published': 'Publicat',
    'blog.minRead':   'min de citit',
    'blog.toc':       'Cuprins',
    'blog.faq':       'Întrebări frecvente',
    'blog.sources':   'Surse',
    'blog.related':   'Citește și',
    'blog.share':     'Distribuie',
    'blog.copy':      'Copiază linkul',
    'blog.rss':       'Flux RSS',
    'blog.empty':     'Încă nu există articole publicate în această temă.',
    'blog.draft':     'CIORNĂ — nu este publicat',
    'blog.category':  'Tema',

    'disclaimer.title': 'Informație medicală generală',
    'disclaimer.body':  'Acest articol are scop informativ și nu înlocuiește consultul medical. Pentru diagnostic și tratament, adresează-te unui medic dermatolog. În caz de urgență, sună la 112.',

    'footer.tagline': 'Dermatologie explicată clar, de un medic specialist.',
    'footer.legal':   'Informații legale',
    'footer.privacy': 'Confidențialitate',
    'footer.login':   'Autentificare',
    'footer.medical': 'Conținutul are scop informativ și nu înlocuiește consultul medical.',

    'nf.title': 'Pagina nu există.',
    'nf.body':  'Linkul poate fi greșit sau pagina a fost mutată.',
    'nf.back':  'Înapoi la pagina principală',
  },
  en: {
    'a11y.skip':     'Skip to content',
    'nav.home':      'Home',
    'nav.articles':  'Articles',
    'nav.topics':    'Topics',
    'nav.about':     'About',
    'nav.contact':   'Contact',
    'nav.menu':      'Menu',
    'nav.book':      'Book a consultation',
    'theme.toggle':  'Switch theme (light / dark)',
    'lang.label':    'Language',

    'meta.title':       'Dermi — dermatology explained by a specialist',
    'meta.description': 'Clear, evidence-based articles on skin, hair and nail health by Dr. Mădălina Iulia Lincu, specialist in dermatology and venereology (Romania).',

    'hero.kicker':   'Dermatology · Aesthetics · Skin care',
    'hero.title1':   'Your skin,',
    'hero.title2':   'explained by a doctor.',
    'hero.lead':     'Clear, evidence-based information about skin conditions, ingredients and routines. Articles are written in Romanian.',
    'hero.cta':      'Read the articles (RO)',
    'hero.cta2':     'About the doctor',

    'home.latest':     'Latest articles (in Romanian)',
    'home.all':        'All articles',
    'home.topics':     'Topics',
    'home.topicsLead': 'Guides organised by topic.',
    'home.empty':      'The first articles are being prepared.',
    'home.principles': 'How we write',
    'p1.title': 'Evidence-based',
    'p1.body':  'Built on dermatology society guidelines and solid studies, with sources shown.',
    'p2.title': 'No false promises',
    'p2.body':  'No guaranteed results, no advertising: what works, what does not, and why.',
    'p3.title': 'Kept up to date',
    'p3.body':  'Every article shows when it was published and last reviewed.',

    'author.label':   'Author',
    'author.more':    'About the author',

    'blog.title':     'Articles',
    'blog.lead':      'Skin health guides (in Romanian).',
    'blog.back':      '← All articles',
    'blog.updated':   'Updated',
    'blog.published': 'Published',
    'blog.minRead':   'min read',
    'blog.toc':       'Contents',
    'blog.faq':       'FAQ',
    'blog.sources':   'Sources',
    'blog.related':   'Related',
    'blog.share':     'Share',
    'blog.copy':      'Copy link',
    'blog.rss':       'RSS feed',
    'blog.empty':     'No articles published in this topic yet.',
    'blog.draft':     'DRAFT — not published',
    'blog.category':  'Topic',

    'disclaimer.title': 'General medical information',
    'disclaimer.body':  'This content is for information only and does not replace a medical consultation. For diagnosis and treatment, see a dermatologist. In an emergency, call 112.',

    'footer.tagline': 'Dermatology, clearly explained by a specialist.',
    'footer.legal':   'Legal notice',
    'footer.privacy': 'Privacy',
    'footer.login':   'Sign in',
    'footer.medical': 'Content is for information only and does not replace medical advice.',

    'nf.title': 'This page does not exist.',
    'nf.body':  'The link may be wrong or the page has moved.',
    'nf.back':  'Back to the homepage',
  },
} as const;

export type UIKey = keyof typeof ui.ro;

export function useTranslations(lang: Lang) {
  return (key: UIKey): string => ui[lang][key] ?? ui.ro[key];
}

// Pages that exist in both languages. Romanian path -> English path.
export const PAGE_PAIRS: Record<string, string> = {
  '/':              '/en/',
  '/despre/':       '/en/about/',
  '/contact/':      '/en/contact/',
  '/legal/':        '/en/legal/',
  '/confidentialitate/': '/en/privacy/',
};

export function translatedPath(path: string, to: Lang): string | undefined {
  if (to === 'en') return PAGE_PAIRS[path];
  return Object.entries(PAGE_PAIRS).find(([, en]) => en === path)?.[0];
}

export const pathIn = (lang: Lang, ro: string) => (lang === 'ro' ? ro : PAGE_PAIRS[ro] ?? ro);
