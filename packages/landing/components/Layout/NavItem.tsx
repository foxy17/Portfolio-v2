import { usePathname } from 'next/navigation';
import cn from 'classnames';
import Link from 'next/link';

interface NavItemProps {
  href: string;
  text: string;
  external?: boolean;
}

export function NavItem({ href, text, external }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      passHref={external}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className={cn(
        isActive
          ? 'font-semibold text-gray-800 dark:text-white'
          : 'font-normal text-gray-600 dark:text-gray-400',
        'hidden group sm:inline-block p-1 sm:px-3 sm:py-2 duration-300 ease-in-out transition-all',
      )}
    >
      <span
        className={cn(
          'capsize',
          'bg-left-bottom bg-gradient-to-r from-dark-grey to-dark-black dark:from-white dark:to-beige',
          'bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out',
        )}
      >
        {text}
      </span>
    </Link>
  );
}