'use client';

import '../styles/globals.css';
import React, { useEffect } from 'react';
import splitbee from '@splitbee/web';
import { ThemeProvider } from '~/lib/hooks/useTheme';

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

  return <ThemeProvider>{children}</ThemeProvider>;
}
