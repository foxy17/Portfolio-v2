'use client';

import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import MobileMenu from '~/src/components/MobileMenu/MobileMenu';
import { useIsMounted } from '~/lib/hooks/userIsMounted';
import { NavItem } from './NavItem';
import { ThemeToggle } from 'ui';

const Footer = dynamic(() => import('~/components/Layout/footer'), {
  ssr: false,
});

export default function NavContainer(props: any) {
  const isMounted = useIsMounted();
  const { resolvedTheme, setTheme } = useTheme();

  const { children, ...customMeta } = props;

  const handleToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

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
          {isMounted && (
            <ThemeToggle
              isDark={resolvedTheme === 'dark'}
              onToggle={handleToggle}
            />
          )}
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
