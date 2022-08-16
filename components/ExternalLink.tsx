import React from 'react';
import cn from 'classnames';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  style?: string;
}

const ExternalLink = ({ href, children, style }: ExternalLinkProps) => (
  <a
    className={cn('text-gray-500 hover:text-gray-600 transition w-full', style)}
    target="_blank"
    rel="noopener noreferrer"
    href={href}
  >
    {children}
  </a>
);

export default ExternalLink;
