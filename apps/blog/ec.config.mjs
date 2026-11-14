import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
  themes: ['github-light', 'github-dark'],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) =>
    theme.type === 'dark' ? '.dark' : ':root:not(.dark)',
  defaultProps: {
    wrap: true,
  },
  frames: {
    showCopyToClipboardButton: true,
  },
  styleOverrides: {
    borderRadius: '0.5rem',
    borderWidth: '1px',
    codeFontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    codeFontSize: '0.9rem',
    codeLineHeight: '1.65',
  },
});
