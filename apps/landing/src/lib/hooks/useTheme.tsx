'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  applyThemeClass,
  readThemeCookie,
  resolveInitialTheme,
  subscribeToThemeCookie,
  writeThemeCookie,
  type Theme,
} from 'ui';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const initial = readThemeCookie() ?? resolveInitialTheme();
    setThemeState(initial);
    applyThemeClass(initial);

    return subscribeToThemeCookie((next) => {
      applyThemeClass(next);
      setThemeState(next);
    });
  }, []);

  const setTheme = useCallback((next: Theme) => {
    applyThemeClass(next);
    writeThemeCookie(next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme: theme, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
