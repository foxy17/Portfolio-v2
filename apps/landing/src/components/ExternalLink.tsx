import React from 'react';
import cn from 'classnames';
import Link from 'next/link';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  style?: string;
}

const ExternalLink = ({ href, children, style }: ExternalLinkProps) => (
  <Link
    className={cn(
      'w-full text-gray-700! transition hover:text-gray-900! dark:text-gray-300! dark:hover:text-white!',
      style,
    )}
    target="_blank"
    rel="noopener noreferrer"
    href={href}
  >
    {children}
  </Link>
);

export default ExternalLink;
