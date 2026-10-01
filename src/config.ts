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
    cmrCode:   '2620033311',
    cmrRegisterUrl: '',
    // Where she practises: collaborator (PFI) at Dr. Leventer Centre, two Bucharest locations
    practice:  { name: 'Dr. Leventer Centre', city: 'București', url: 'https://drleventercentre.com' },
    // Square portrait in public/, ~800×800, e.g. '/assets/madalina-lincu.jpg' (shown once the file exists)
    photo:     '/assets/madalina-lincu.jpg',
    // Small version for avatars (192×192)
    photoSmall: '/assets/madalina-lincu-192.jpg',
    // Public professional profiles (LinkedIn, clinic page, CMR register…) — used for sameAs in JSON-LD
    profiles:  ['https://www.linkedin.com/in/m%C4%83d%C4%83lina-lincu-7ab696186'] as string[],
  },

  email: 'contact@dermi.ro',

  // Online booking page (e.g. the clinic's booking system). When set, "Programează o consultație" appears.
  bookingUrl: '',
} as const;
