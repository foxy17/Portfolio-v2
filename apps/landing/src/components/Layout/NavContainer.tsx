'use client';

import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import MobileMenu from '~/src/components/MobileMenu/MobileMenu';
import { useIsMounted } from '~/lib/hooks/userIsMounted';
import { NavItem } from './NavItem';

const Footer = dynamic(() => import('~/components/Layout/footer'), {
  ssr: false,
});

export default function NavContainer(props: any) {
  const isMounted = useIsMounted();
  const { resolvedTheme, setTheme } = useTheme();

  const { children, ...customMeta } = props;

  return (
    <div className="min-h-screen bg-beige dark:bg-dark-black">
      <div className="flex flex-col justify-center px-8">
        <nav className="flex items-center justify-between w-full relative max-w-4xl border-gray-200 dark:border-gray-700 mx-auto pt-8 pb-8 sm:pb-[72px] text-gray-900 bg-beige dark:bg-dark-black bg-opacity-60 dark:text-beige">
          <a href="~/components/Layout/NavContainer#skip" className="skip-nav">
            Skip to content
          </a>
          <div className="ml-[-0.60rem]">
            <MobileMenu />
            <NavItem href="/" text="Home" />
            {/*<NavItem href="/timeline" text="Timeline" />*/}
            {/*<NavItem href="/projects" text="Work" />*/}
            <NavItem href="https://dev.to/foxy17" external={true} text="Blog" />
          </div>
          <button
            aria-label="Toggle Dark Mode"
            type="button"
            className="w-9 h-9 bg-gray-200 rounded-lg dark:bg-gray-600 flex items-center justify-center  hover:ring-2 ring-gray-300  transition-all"
            onClick={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
          >
            {isMounted && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5 text-gray-800 dark:text-gray-200"
              >
                {resolvedTheme === 'dark' ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                )}
              </svg>
            )}
          </button>
        </nav>
      </div>
      <main
        id="skip"
        className="flex flex-col justify-center px-8 bg-beige dark:bg-dark-black"
      >
        {children}
        <Footer />
        <div id="footer"></div>
      </main>
    </div>
  );
}
