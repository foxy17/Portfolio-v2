import { baseUrl } from '~/config/constants';
import { Metadata } from 'next';

const description =
  "Arnav Chauhan — generalist software engineer. Best on cross-layer problems where the symptom and the fix don't live in the same service.";

const siteMetaDeta: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Arnav Chauhan | Generalist Software Engineer',
  description,
  alternates: {
    canonical: baseUrl,
    types: {
      'application/rss+xml': [
        {
          url: 'https://blog.carnav.in/rss.xml',
          title: 'Arnav Chauhan – Blog',
        },
      ],
    },
  },
  authors: [{ name: 'Arnav Chauhan', url: baseUrl }],
  creator: 'Arnav Chauhan',
  publisher: 'Arnav Chauhan',
  openGraph: {
    title: 'Arnav Chauhan',
    description,
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/static/arnav.png`,
        width: 800,
        height: 600,
        alt: 'Arnav Chauhan',
      },
    ],
    siteName: 'Arnav Chauhan',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    creator: '@arnav_sde',
    site: baseUrl + '/',
    card: 'summary_large_image',
    siteId: '2336244612',
    creatorId: '2336244612',
  },
};

export default siteMetaDeta;
