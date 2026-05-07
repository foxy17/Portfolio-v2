import { baseUrl } from '~/config/constants';
import { Metadata } from 'next';

const description =
  "Arnav Chauhan — generalist software engineer. Best on cross-layer problems where the symptom and the fix don't live in the same service.";

const siteMetaDeta: Metadata = {
  title: 'Arnav Chauhan | Generalist Software Engineer',
  description,
  openGraph: {
    title: 'Arnav Chauhan',
    description,
    images: [
      {
        url: `${baseUrl}/static/arnav.png`,
        width: 800,
        height: 600,
        alt: 'profile picture',
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
