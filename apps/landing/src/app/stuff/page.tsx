import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { FiArrowUpRight } from 'react-icons/fi';

import ProjectShowcase from '~/components/Stuff/ProjectShowcase';
import ProjectShaderCanvas from '~/components/Stuff/ProjectShaderCanvas';
import NavContainer from '~/components/Layout/NavContainer';
import SocialsLine from '~/components/SocialLine/SocialLine';
import { baseUrl } from '~/config/constants';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Stuff | Arnav Chauhan',
  description:
    'Projects, tools, and product experiments built by Arnav Chauhan, including Iframe Test and a Next.js plus Astro portfolio monorepo.',
  keywords: [
    'Arnav Chauhan projects',
    'Stuff I Built',
    'Iframe Test',
    'Next.js portfolio',
    'Astro blog',
    'frontend projects',
  ],
  alternates: {
    canonical: '/stuff',
  },
  openGraph: {
    title: 'Stuff | Arnav Chauhan',
    description:
      'A focused shelf of tools and systems built by Arnav Chauhan.',
    type: 'website',
    url: `${baseUrl}/stuff`,
    images: [
      {
        url: `${baseUrl}/images/stuff/portfolio-system/home.png`,
        width: 1440,
        height: 1000,
        alt: 'Arnav Chauhan portfolio home page',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stuff | Arnav Chauhan',
    description:
      'A focused shelf of tools and systems built by Arnav Chauhan.',
    images: [`${baseUrl}/images/stuff/portfolio-system/home.png`],
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Stuff I Built',
  description:
    'Projects, tools, and product experiments built by Arnav Chauhan.',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'SoftwareApplication',
        position: 1,
        name: 'Iframe Test',
        applicationCategory: 'DeveloperApplication',
        url: 'https://testmyiframe.in/',
        description:
          'A focused tool for testing iframe behavior with dimensions, permissions, sandbox settings, and quick presets.',
      },
      {
        '@type': 'WebSite',
        position: 2,
        name: 'Portfolio System',
        url: baseUrl,
        description:
          'A portfolio monorepo with a Next.js landing app and an Astro writing app.',
      },
    ],
  },
};

export default function StuffPage() {
  return (
    <NavContainer>
      <section className="stuff-page-shell mx-auto pb-20 text-dark-grey dark:text-beige">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <div className="relative mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-flat-purple dark:text-flat-yellow">
            Built shelf
          </p>
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="max-w-full break-words text-4xl sm:text-6xl">
                Stuff I Built
              </h1>
              <p className="mt-5 max-w-full text-lg leading-8 text-gray-700 dark:text-gray-300 sm:text-xl">
                A compact shelf of projects, utilities, experiments, and
                systems that I keep shaping around performance, usability, and
                a bit of personality.
              </p>
            </div>
            <Link
              href="https://github.com/foxy17"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-lg border-2 border-black bg-flat-yellow px-4 py-3 font-semibold text-black drop-shadow-card-dark transition duration-300 hover:-translate-x-1 hover:-translate-y-1 dark:border-white dark:bg-flat-purple dark:text-white dark:drop-shadow-card"
            >
              <ProjectShaderCanvas
                variant="button"
                className="opacity-80 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-100 dark:mix-blend-screen"
              />
              <span className="absolute inset-0 bg-white/20 dark:bg-black/10" />
              <span className="relative z-10">GitHub</span>
              <FiArrowUpRight className="relative z-10 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <h2 className="text-3xl sm:text-4xl">Selected Builds</h2>
          <div className="h-1 w-full rounded-full bg-linear-to-r from-flat-purple via-flat-blue to-flat-green dark:from-flat-yellow dark:via-flat-pink dark:to-flat-blue sm:flex-1" />
        </div>

        <ProjectShowcase />
      </section>
      <SocialsLine />
    </NavContainer>
  );
}
