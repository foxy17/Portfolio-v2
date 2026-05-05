import { useEffect, useState } from 'react';
import {
  ThemeToggle,
  applyThemeClass,
  readThemeCookie,
  subscribeToThemeCookie,
  writeThemeCookie,
} from 'ui';

export default function ThemeToggleWrapper() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));

    return subscribeToThemeCookie((next) => {
      applyThemeClass(next);
      setIsDark(next === 'dark');
    });
  }, []);

  const handleToggle = () => {
    const next = readThemeCookie() === 'dark' || isDark ? 'light' : 'dark';
    applyThemeClass(next);
    writeThemeCookie(next);
    setIsDark(next === 'dark');
  };

  return <ThemeToggle isDark={isDark} onToggle={handleToggle} />;
}
