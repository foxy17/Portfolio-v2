import {NextSeo} from 'next-seo';
import Head from 'next/head';
import siteMetaData from '~/data/seo';

function SEO({...customMeta}: any) {
    const meta = {
        ...siteMetaData,
        ...customMeta,
    };

    return (
        <>
            <Head>
                {meta.date && (
                    <meta property="article:published_time" content={meta.date}/>
                )}
            </Head>
            <NextSeo {...meta} />
        </>
    );
}

export default SEO;