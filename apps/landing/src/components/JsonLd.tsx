import { baseUrl } from '~/config/constants';

// Person + WebSite JSON-LD. The Person @id matches the one used by the blog
// (https://carnav.in/#person) so search engines collapse both sites into a
// single entity graph. sameAs lists every external presence.
export default function JsonLd() {
  const personId = `${baseUrl}/#person`;
  const websiteId = `${baseUrl}/#website`;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Person',
      '@id': personId,
      name: 'Arnav Chauhan',
      url: baseUrl,
      jobTitle: 'Generalist Software Engineer',
      sameAs: [
        'https://blog.carnav.in/',
        'https://github.com/foxy17',
        'https://twitter.com/arnav_sde',
        'https://www.linkedin.com/in/arnavschauhan/',
        'https://arnav40.medium.com/',
        'https://dev.to/foxy17',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: baseUrl,
      name: 'Arnav Chauhan',
      inLanguage: 'en',
      publisher: { '@id': personId },
    },
  ];

  const jsonLd = { '@context': 'https://schema.org', '@graph': graph };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
