# UI Package

This package contains shared UI components for use across Next.js and Astro applications.

## Components

- `ThemeToggle`: A theme toggle button component for dark/light mode.

## Setup with Tailwind CSS

This package uses Tailwind CSS classes but doesn't export any CSS files. Instead, it relies on the Tailwind configuration in each consuming project.

### Installation

```bash
npm install ui
```

### Usage

#### In Next.js:

1. Import the component:
```jsx
import { ThemeToggle } from 'ui';
```

2. Update your `tailwind.config.js` to include the UI package in the content array:
```js
module.exports = {
  content: [
    // ... other content paths
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  // ... rest of your config
};
```

#### In Astro:

1. Import the component:
```jsx
import { ThemeToggle } from 'ui';
```

2. Update your `tailwind.config.js` to include the UI package in the content array:
```js
module.exports = {
  content: [
    // ... other content paths
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  // ... rest of your config
};
```

Both your Next.js and Astro projects already use the shared Tailwind configuration from `@portfolio/tailwind-config`, so the UI components will have consistent styling across both platforms without needing to export any CSS from this package. 