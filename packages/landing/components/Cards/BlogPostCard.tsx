import cn from 'classnames';
import React from 'react';
import { Article } from '~/lib/types';
import ExternalLink from '~/components/ExternalLink';
import { PenSvg } from '~/components/Cards/PenSvg';

type FeaturedPostCardProps = {
  gradient: string;
} & Article;

export default function BlogPostCard({
  title,
  url,
  publishedAt,
  gradient,
}: FeaturedPostCardProps) {
  return (
    <div className="rounded-xl block group relative w-full md:w-1/3 h-full">
      <span
        className="absolute inset-0 border-2 border-black dark:border-white w-full border-dashed rounded-xl"
        aria-hidden="true"
      ></span>
      <div
        className={cn(
          'transform group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all',
          'rounded-xl w-full bg-gradient-to-r p-1 justify-center items-center',
          gradient,
        )}
      >
        <ExternalLink href={url}>
          <div className="md:h-48 flex flex-col justify-between h-full bg-beige dark:bg-dark-black rounded-lg p-4">
            <div className="flex flex-col md:flex-row justify-between md:h-32">
              <h4 className="line-clamp-3 text-lg font-medium mb-6 sm:mb-10 w-full text-gray-900 dark:text-gray-100 tracking-tight">
                {title}
              </h4>
            </div>
            <div className="flex items-center text-gray-800 dark:text-gray-200 capsize">
              <span
                className="flex flex-row capsize"
                style={{ alignItems: 'inherit' }}
              >
                <PenSvg style="mr-2" />

                {publishedAt}
              </span>
            </div>
          </div>
        </ExternalLink>
      </div>
    </div>
  );
}
