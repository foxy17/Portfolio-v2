import { NextSeo } from 'next-seo';
import merge from 'lodash/merge';
import Head from 'next/head';
import siteMetaData from '~/data/seo';
import { useRouter } from 'next/router';
import {baseUrl} from "~/config/constants";

function SEO({ customMeta }: any) {
  const meta = merge(siteMetaData, customMeta);

  const router = useRouter();

  return (
    <>
      <Head>
        {meta.date && (
          <meta property="article:published_time" content={meta.date} />
        )}
        <meta property="og:url" content={`${baseUrl}${router.asPath}`} />
        <link rel="canonical" href={`${baseUrl}${router.asPath}`} />
      </Head>
      <NextSeo {...meta} />
    </>
  );
}

export default SEO;
