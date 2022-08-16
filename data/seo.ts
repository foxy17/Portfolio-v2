import {NextSeoProps} from "next-seo/lib/types";

const siteMetaDeta:NextSeoProps = {
    title: 'Arnav Chauhan | Product Engineer',
    canonical: 'https://carnav.in',
    description:
        'Arnav is a Front-end developer, JavaScript enthusiast, who specializes in building cross-platform digital experiences. Currently exploring the world of web3, interactive animations, and user experience.',
    openGraph: {
        url: 'https://carnav.in',
        title: 'Arnav Chauhan',
        description:
            'Arnav is a Front-end developer who specializes in building cross-platform digital experiences. Currently exploring the world of web3, interactive animations, and user experience.',
        images: [
            {
                url: 'https://carnav.in/static/arnav.png',
                width: 800,
                height: 600,
                alt: '/',
            },
        ],
        site_name: 'Arnav Chauhan | Product Engineer',
    },
    twitter: {
        handle: '@arnav_sde',
        site: 'https://carnav.in/',
        cardType: 'summary_large_image',
    },
};

export default siteMetaDeta;