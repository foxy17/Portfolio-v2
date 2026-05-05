export type Theme = 'dark' | 'light';

export const THEME_COOKIE = 'theme';
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getCookieDomain(hostname: string): string {
  if (hostname.endsWith('carnav.in')) return '; domain=.carnav.in';
  return '';
}

export function readThemeCookie(): Theme | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(/(?:^|; )theme=(dark|light)/);
  return m ? (m[1] as Theme) : null;
}

export function writeThemeCookie(theme: Theme): void {
  if (typeof document === 'undefined') return;
  const domain = getCookieDomain(location.hostname);
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax${domain}`;
}

export function applyThemeClass(theme: Theme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function resolveInitialTheme(): Theme {
  const stored = readThemeCookie();
  if (stored) return stored;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export const themeInitScript = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(dark|light)/);var t=m?m[1]:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');}catch(e){}})();`;
