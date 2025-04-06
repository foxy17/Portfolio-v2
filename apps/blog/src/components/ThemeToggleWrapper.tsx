import { useEffect, useState } from 'react';
import { ThemeToggle } from 'ui';

export default function ThemeToggleWrapper() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
    setMounted(true);
  }, []);

  const handleToggle = () => {
    // Toggle dark mode
    document.documentElement.classList.toggle('dark');
    const newIsDark = document.documentElement.classList.contains('dark');

    // Update state
    setIsDark(newIsDark);

    // Persist to localStorage
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };


  return (
    <ThemeToggle
        isDark={isDark}
        onToggle={handleToggle}
      />
  );
}