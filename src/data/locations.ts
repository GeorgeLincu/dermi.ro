// Where Dr. Mădălina Iulia Lincu consults (collaborator at Dr. Leventer Centre) and when.
// Source: the owner, October 2026. Coordinates: OpenStreetMap points of the two clinics.
// Mini maps: public/assets/maps/<id>.webp (© OpenStreetMap contributors), regenerate if a location changes.

export const SCHEDULE_UPDATED = { ro: 'octombrie 2026', en: 'October 2026', iso: '2026-10' };

type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export const DAY_NAMES: Record<Day, { ro: string; en: string; index: number }> = {
  Monday: { ro: 'Luni', en: 'Monday', index: 1 },
  Tuesday: { ro: 'Marți', en: 'Tuesday', index: 2 },
  Wednesday: { ro: 'Miercuri', en: 'Wednesday', index: 3 },
  Thursday: { ro: 'Joi', en: 'Thursday', index: 4 },
  Friday: { ro: 'Vineri', en: 'Friday', index: 5 },
  Saturday: { ro: 'Sâmbătă', en: 'Saturday', index: 6 },
  Sunday: { ro: 'Duminică', en: 'Sunday', index: 0 },
};

export interface Location {
  id: string;
  name: string;
  short: { ro: string; en: string };
  street: string;
  district: string;
  postalCode: string;
  city: string;
  lat: number;
  lng: number;
  hours: { day: Day; opens: string; closes: string }[];
}

export const LOCATIONS: Location[] = [
  {
    id: 'leventer-monetariei',
    name: 'Dr. Leventer Centre',
    short: { ro: 'Monetăriei (Piața Victoriei)', en: 'Monetăriei (Victoriei Square)' },
    street: 'Strada Monetăriei nr. 8',
    district: 'Sector 1',
    postalCode: '011216',
    city: 'București',
    lat: 44.4546707,
    lng: 26.0829244,
    hours: [
      { day: 'Monday', opens: '14:00', closes: '19:00' },
      { day: 'Tuesday', opens: '08:00', closes: '14:00' },
      { day: 'Thursday', opens: '12:00', closes: '18:00' },
    ],
  },
  {
    id: 'leventer-herastrau',
    name: 'Dr. Leventer Centre',
    short: { ro: 'Herăstrău (Primăverii)', en: 'Herăstrău (Primăverii)' },
    street: 'Strada Herăstrău nr. 9',
    district: 'Sector 1',
    postalCode: '011971',
    city: 'București',
    lat: 44.4680027,
    lng: 26.0880793,
    hours: [
      { day: 'Wednesday', opens: '12:00', closes: '18:00' },
      { day: 'Friday', opens: '15:00', closes: '20:00' },
    ],
  },
];

const addressLine = (l: Location) => `${l.name}, ${l.street}, ${l.district}, ${l.city}`;

// Universal map links: open the Google Maps / Waze app on phones, the website on desktop
export const mapLinks = (l: Location) => ({
  google: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine(l))}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressLine(l))}`,
  waze: `https://waze.com/ul?ll=${l.lat},${l.lng}&navigate=yes`,
});

export const fullAddress = (l: Location) => `${l.street}, ${l.district}, ${l.postalCode} ${l.city}`;

/** All consulting slots in week order (Monday first) */
export const WEEK = LOCATIONS.flatMap(l => l.hours.map(h => ({ ...h, location: l })))
  .sort((a, b) => ((DAY_NAMES[a.day].index + 6) % 7) - ((DAY_NAMES[b.day].index + 6) % 7));
