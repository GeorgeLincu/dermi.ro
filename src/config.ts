// Site-wide settings. Anything left empty ('') is simply hidden on the site — never fill in
// credentials, clinics or links that aren't real.
export const CONFIG = {
  site:   'https://dermi.ro',
  domain: 'dermi.ro',
  brand:  'Dermi',

  // The doctor behind the site (author of every article)
  doctor: {
    name:      'Dr. Mădălina Iulia Lincu',
    shortName: 'Dr. Mădălina Lincu',
    givenName: 'Mădălina Iulia',
    familyName: 'Lincu',
    title:     { ro: 'Medic specialist Dermatovenerologie', en: 'Specialist in Dermatology and Venereology' },
    // Colegiul Medicilor din România — public register entry / CMR code (shown when set)
    cmrCode:   '',
    cmrRegisterUrl: '',
    // Where she practises, e.g. { name: 'Clinica X', city: 'București', url: 'https://…' }
    practice:  { name: '', city: '', url: '' },
    // Square portrait in public/, ~800×800, e.g. '/assets/madalina-lincu.jpg' (shown once the file exists)
    photo:     '/assets/madalina-lincu.jpg',
    // Public professional profiles (LinkedIn, clinic page, CMR register…) — used for sameAs in JSON-LD
    profiles:  [] as string[],
  },

  email: 'contact@dermi.ro',

  // Online booking page (e.g. the clinic's booking system). When set, "Programează o consultație" appears.
  bookingUrl: '',
} as const;
