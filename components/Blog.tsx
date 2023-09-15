import { ReactNode } from 'react';

type BlogProps = {
  children: ReactNode;
  author?: string;
  title: string;
  description: string;
  publishedAt: string;
  cover?: string;
  category?: string;
  readingTime?: Record<string, string>;
  hideAuthor?: boolean;
  wordOccurrences: number;
};

export default function BlogLayout({
  children,
  title,
  publishedAt,
  cover = '',
  readingTime,
  hideAuthor,
  author,
  description,
  wordOccurrences,
}: BlogProps) {
  return (
    <article>
      <div className="min-h-screen w-full pt-0 px-4 pb-8">
        <h3>On this page</h3>
          <div>
            {/*{post.headings.map(heading => {*/}
            {/*  return (*/}
            {/*      <a*/}
            {/*          className="data-[level=two]:pl-2 data-[level=three]:pl-4"*/}
            {/*          data-level={heading.level}*/}
            {/*          href={heading.slug}*/}
            {/*      >*/}
            {/*        {heading.text}*/}
            {/*      </a>*/}

            {/*  )*/}
            {/*})}*/}
          </div>
        <div className="w-full max-w-4xl my-0 mx-auto">
          <h1 className="text-3xl sm:text-6xl font-bold sm:font-black mb-8 leading-normal font-sans">
            {title}
          </h1>
          <div className="text-opacity-70 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 text-gray-700 dark:text-gray-200">
            <div className="flex items-center">
              <img
                width={30}
                height={30}
                alt="Arnav Chauhan"
                src="/images/potrait-sm.webp"
                loading="lazy"
              />
              <p className="ml-2 text-md text-dark-grey dark:text-white">
                {author || 'Arnav Chauhan'}
              </p>
            </div>
            <p className="text-dark-grey dark:text-white">
              {publishedAt}
              {readingTime ? ` · ${readingTime.text}` : ''}
            </p>
          </div>
          <img
            alt={title}
            src={cover}
            width="100%"
            loading="lazy"
            className="rounded-xl"
          />
          <div className="text-black dark:text-white mt-8 text-md sm:text-xl font-sans tracking-wide word-md">
            {children}
          </div>
          <span className="text-black dark:text-white">Javascript : {wordOccurrences}</span>
        </div>
      </div>
    </article>
  );
}
