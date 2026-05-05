import { useEffect, useState } from 'react';
import {
  ThemeToggle,
  applyThemeClass,
  readThemeCookie,
  writeThemeCookie,
} from 'ui';

export default function ThemeToggleWrapper() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const handleToggle = () => {
    const next = readThemeCookie() === 'dark' || isDark ? 'light' : 'dark';
    applyThemeClass(next);
    writeThemeCookie(next);
    setIsDark(next === 'dark');
  };

  return <ThemeToggle isDark={isDark} onToggle={handleToggle} />;
}
