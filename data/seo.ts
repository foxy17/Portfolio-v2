import { NextSeoProps } from 'next-seo/lib/types';
import { baseUrl } from '~/config/constants';

const siteMetaDeta: NextSeoProps = {
  title: 'Arnav Chauhan | Product Engineer | SDE-2',
  description:
    'Arnav is a SDE-2 Front-end developer, JavaScript enthusiast, who specializes in building cross-platform digital experiences. Currently exploring the world of web3, interactive animations, and user experience.',
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
    site_name: 'Arnav Chauhan | Product Engineer',
    type: 'website',
  },
  twitter: {
    handle: '@arnav_sde',
    site: baseUrl + '/',
    cardType: 'summary_large_image',
  },
};

export default siteMetaDeta;
