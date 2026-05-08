import Link from 'next/link';
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';

import NavContainer from '~/components/Layout/NavContainer';

export default function NotFound() {
  return (
    <NavContainer>
      <section className="mx-auto flex min-h-[55vh] w-full max-w-4xl items-center pb-20 text-dark-grey dark:text-beige">
        <div className="relative w-full overflow-hidden rounded-xl border-2 border-black bg-beige-200 p-6 shadow-[8px_8px_0_#000] dark:border-white dark:bg-dark-grey dark:shadow-[8px_8px_0_rgba(255,255,255,0.85)] sm:p-10">
          <div
            className="absolute inset-x-0 top-0 h-2 rounded-t-lg bg-linear-to-r from-flat-yellow via-flat-purple to-flat-blue"
            aria-hidden="true"
          />
          <div className="grid items-center gap-8 md:grid-cols-[1fr_16rem]">
            <div>
              <p className="mb-4 w-fit rounded-md border-2 border-black bg-flat-yellow px-3 py-1 text-sm font-bold text-black dark:border-white dark:bg-[#5b3f8f] dark:text-white">
                404
              </p>
              <div className="max-w-2xl">
                <h1 className="mb-4 max-w-full break-words text-4xl leading-none sm:text-6xl">
                  Page not found
                </h1>
                <p className="text-lg leading-8 text-gray-800 dark:text-gray-200 sm:text-xl">
                  This page either moved, never existed, or the URL has a typo.
                  Head back home or browse the stuff I built.
                </p>
              </div>
            </div>

            <div
              className="not-found-meme relative mx-auto h-32 w-full max-w-48 rounded-xl border-2 border-black bg-white p-3 text-black shadow-[6px_6px_0_#000] dark:border-white dark:bg-dark-black dark:text-white dark:shadow-[6px_6px_0_rgba(255,255,255,0.85)] sm:h-40 sm:max-w-52 md:h-44 md:max-w-56"
              aria-hidden="true"
            >
              <div className="mb-3 flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-flat-pink" />
                <span className="h-3 w-3 rounded-full bg-flat-yellow" />
                <span className="h-3 w-3 rounded-full bg-flat-green" />
              </div>
              <div className="rounded-lg border-2 border-black bg-beige p-3 dark:border-white dark:bg-dark-grey">
                <p className="mb-2 font-paytone text-xl leading-none sm:text-2xl">
                  404.exe
                </p>
                <div className="h-3 overflow-hidden rounded-full border-2 border-black bg-white dark:border-white dark:bg-dark-black">
                  <span className="not-found-loader block h-full w-1/2 rounded-full bg-flat-yellow dark:bg-[#5b3f8f]" />
                </div>
              </div>
              <div className="not-found-sticker absolute -right-3 bottom-3 rotate-6 rounded-lg border-2 border-black bg-flat-blue px-3 py-2 font-paytone text-2xl text-black shadow-[3px_3px_0_#000] dark:border-white dark:text-black sm:-right-4 sm:bottom-4 sm:text-3xl">
                ?
              </div>
            </div>
          </div>
          <nav
            aria-label="Not found page actions"
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-black bg-white px-4 py-3 font-bold text-black transition hover:-translate-y-1 focus-visible:outline-4 focus-visible:outline-flat-blue dark:border-white dark:bg-dark-black dark:text-white"
            >
              <FiArrowLeft aria-hidden="true" />
              Return home
            </Link>
            <Link
              href="/stuff"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-black bg-flat-yellow px-4 py-3 font-bold text-black shadow-[4px_4px_0_#000] transition hover:-translate-x-1 hover:-translate-y-1 focus-visible:outline-4 focus-visible:outline-flat-blue dark:border-white dark:bg-[#5b3f8f] dark:text-white dark:shadow-[4px_4px_0_rgba(255,255,255,0.85)]"
            >
              See stuff
              <FiArrowUpRight aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </section>
    </NavContainer>
  );
}
