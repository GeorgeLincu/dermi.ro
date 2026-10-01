// Topic clusters. The id is used in frontmatter (category:) and in URLs (/blog/categorie/<id>/).
export const CATEGORIES = {
  'afectiuni': {
    ro: { name: 'Afecțiuni ale pielii', desc: 'Acnee, rozacee, dermatită, psoriazis, alunițe și alte boli de piele, păr și unghii — explicate clar.' },
    en: { name: 'Skin conditions', desc: 'Acne, rosacea, eczema, psoriasis, moles and other skin, hair and nail conditions.' },
  },
  'estetica': {
    ro: { name: 'Dermatologie estetică', desc: 'Toxina botulinică, fillere, peelinguri, laser și alte proceduri: ce pot face, ce riscuri au și cum alegi corect.' },
    en: { name: 'Aesthetic dermatology', desc: 'Botulinum toxin, fillers, peels, lasers and other procedures: realistic results and risks.' },
  },
  'ingrediente': {
    ro: { name: 'Ingrediente', desc: 'Retinol, niacinamidă, vitamina C, acizi, ceramide: ce fac, ce dovezi există și cum le folosești.' },
    en: { name: 'Ingredients', desc: 'Retinoids, niacinamide, vitamin C, acids, ceramides: what the evidence says.' },
  },
  'protectie-solara': {
    ro: { name: 'Protecție solară', desc: 'Cum alegi și aplici corect protecția solară, pentru adulți și copii.' },
    en: { name: 'Sun protection', desc: 'How to choose and apply sunscreen correctly, for adults and children.' },
  },
  'rutine': {
    ro: { name: 'Rutine de îngrijire', desc: 'Rutine simple, pe tip de piele, anotimp și etapă de viață.' },
    en: { name: 'Skincare routines', desc: 'Simple routines by skin type, season and life stage.' },
  },
  'consultatii': {
    ro: { name: 'Consultații și investigații', desc: 'Când mergi la dermatolog, ce se întâmplă la consultație și ce este dermatoscopia.' },
    en: { name: 'Consultations', desc: 'When to see a dermatologist and what happens during a visit.' },
  },
} as const;

export type CategoryId = keyof typeof CATEGORIES;
export const CATEGORY_IDS = Object.keys(CATEGORIES) as [CategoryId, ...CategoryId[]];
