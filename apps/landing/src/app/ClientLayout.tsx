'use client';

import '../styles/globals.css';
import React, { useEffect } from 'react';
import splitbee from '@splitbee/web';
import { ThemeProvider } from 'next-themes';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect((): void => {
    splitbee.init({
      apiUrl: '/sb-api',
      scriptUrl: '/sb.js',
    });
  }, []);

  return <ThemeProvider attribute="class">{children} </ThemeProvider>;
}
