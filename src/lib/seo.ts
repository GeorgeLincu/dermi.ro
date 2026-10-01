import { CONFIG } from '../config';
import { CATEGORIES } from './categories';
import type { Post } from './site';
import type { Lang } from '../i18n/ui';

const site = CONFIG.site;
const doc  = CONFIG.doctor;
const personRef  = { '@id': `${site}/#doctor` };
const websiteRef = { '@id': `${site}/#website` };

/** The doctor as a schema.org Person — referenced by every article as author */
export function personNode(lang: Lang = 'ro') {
  const sameAs = [...doc.profiles, doc.cmrRegisterUrl].filter(Boolean);
  return {
    '@type': 'Person',
    '@id': `${site}/#doctor`,
    name: doc.name,
    givenName: doc.givenName,
    familyName: doc.familyName,
    honorificPrefix: 'Dr.',
    jobTitle: doc.title[lang],
    url: `${site}/despre/`,
    email: `mailto:${CONFIG.email}`,
    knowsLanguage: ['ro', 'en'],
    knowsAbout: ['Dermatologie', 'Dermatologie estetică', 'Dermatoscopie', 'Acnee', 'Rozacee', 'Dermatită atopică',
      'Psoriazis', 'Toxină botulinică', 'Peeling chimic', 'Îngrijirea pielii', 'Protecție solară'],
    hasOccupation: {
      '@type': 'Occupation',
      name: doc.title.ro,
      occupationalCategory: '2212 Specialist medical practitioners (ISCO-08)',
    },
    ...(doc.practice.name ? { worksFor: { '@type': 'MedicalOrganization', name: doc.practice.name, ...(doc.practice.url ? { url: doc.practice.url } : {}) } } : {}),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function websiteJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${site}/#website`,
        url: `${site}/`,
        name: CONFIG.brand,
        alternateName: 'dermi.ro',
        description: lang === 'ro'
          ? 'Dermatologie explicată de un medic specialist dermatovenerolog.'
          : 'Dermatology explained by a specialist in dermatology and venereology.',
        inLanguage: ['ro', 'en'],
        publisher: personRef,
      },
      personNode(lang),
    ],
  };
}

export function aboutJsonLd(lang: Lang, path: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'ProfilePage', '@id': `${site}${path}#profile`, url: `${site}${path}`, inLanguage: lang,
        mainEntity: personRef, isPartOf: websiteRef },
      personNode(lang),
    ],
  };
}

export function postJsonLd(post: Post, image: string) {
  const url = `${site}/blog/${post.id}/`;
  const cat = CATEGORIES[post.data.category].ro;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.data.title,
      description: post.data.description,
      url,
      mainEntityOfPage: url,
      datePublished: post.data.pubDate.toISOString(),
      dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
      inLanguage: 'ro',
      articleSection: cat.name,
      keywords: post.data.tags.join(', '),
      image: new URL(post.data.image ?? image, site).href,
      author: personRef,
      publisher: personRef,
      isPartOf: websiteRef,
      ...(post.data.sources.length > 0 && {
        citation: post.data.sources.map(s => ({ '@type': 'CreativeWork', name: s.title,
          ...(!!s.publisher && { publisher: { '@type': 'Organization', name: s.publisher } }), ...(!!s.url && { url: s.url }) })),
      }),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Acasă', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: cat.name, item: `${site}/blog/categorie/${post.data.category}/` },
        { '@type': 'ListItem', position: 3, name: post.data.title, item: url },
      ],
    },
    personNode('ro'),
  ];
  if (post.data.faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: post.data.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function collectionJsonLd(name: string, path: string, posts: Post[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: `${site}${path}`,
    isPartOf: websiteRef,
    inLanguage: 'ro',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site}/blog/${p.id}/` })),
    },
  };
}
