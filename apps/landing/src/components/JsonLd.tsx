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

  // Escape characters that could break out of a <script> element or trip up
  // parsers if the data ever contains `</script>` or U+2028 / U+2029.
  const safeJson = JSON.stringify(jsonLd).replace(
    /[<\u2028\u2029]/g,
    (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`,
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
