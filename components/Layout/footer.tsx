import Link from 'next/link';

import NowPlaying from '~/components/NowPlaying';
import React from 'react';
import ExternalLink from '~/components/ExternalLink';

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center items-start max-w-4xl mx-auto w-full">
      <hr className="w-full border-1 border-gray-200 dark:border-gray-800 mb-8" />
      <NowPlaying />
      <div className="w-full max-w-4xl grid grid-cols-2 gap-4 pb-16 sm:grid-cols-3">
        <div className="flex flex-col space-y-4">
          <Link href="/">
            <a className="text-gray-500 hover:text-gray-600 transition">Home</a>
          </Link>
          <Link href="/">
            <a className="text-gray-500 hover:text-gray-600 transition">
              About
            </a>
          </Link>
          <ExternalLink
            style="showSocial:hidden block"
            href="https://dev.to/foxy17"
          >
            Linkedin
          </ExternalLink>
        </div>

        <div className="flex flex-col space-y-4">
          <ExternalLink href="https://dev.to/foxy17">Dev.to</ExternalLink>
          <ExternalLink
            style="showSocial:hidden block"
            href="https://twitter.com/arnav_sde"
          >
            Twitter
          </ExternalLink>

          <ExternalLink
            style="showSocial:hidden block"
            href="https://dev.to/foxy17"
          >
            Polygon
          </ExternalLink>
        </div>

        <div className="flex flex-col space-y-4">
          <ExternalLink href="https://arnav40.medium.com/">Medium</ExternalLink>
          <ExternalLink
            style="showSocial:hidden block"
            href="https://arnav40.medium.com/"
          >
            Github
          </ExternalLink>
        </div>
      </div>
    </footer>
  );
}