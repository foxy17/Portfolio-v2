import { baseUrl } from '~/config/constants';
import { Metadata } from 'next';

const siteMetaDeta: Metadata = {
  title: 'Arnav Chauhan | Product Engineer | SDE-3',
  description:
    'Arnav is a SDE-3 Front-end developer, JavaScript enthusiast, who specializes in building cross-platform digital experiences. Currently exploring the world of web3, interactive animations, and user experience.',
  openGraph: {
    title: 'Arnav Chauhan',
    description:
      'Arnav is a SDE-2 Front-end developer who specializes in building cross-platform digital experiences. Currently exploring the world of web3, interactive animations, and user experience.',
    images: [
      {
        url: `${baseUrl}/static/arnav.png`,
        width: 800,
        height: 600,
        alt: 'profile picture',
      },
    ],
    siteName: 'Arnav Chauhan | Product Engineer',
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
