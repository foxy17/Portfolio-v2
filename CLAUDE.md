# Portfolio-v2 — Hybrid Next.js + Astro Monorepo

## Intent

This repo is a **hybrid portfolio**:

- **Main site** (`/`, landing pages, interactive UI) — **Next.js**.
- **Blog** (`blog.<domain>`, content-heavy, mostly static) — **Astro**.

The two apps live side-by-side in a Turborepo monorepo and **share as much as possible**: design tokens, Tailwind theme, dark-mode strategy, and React UI primitives. Each app deploys as its **own Vercel project** but pulls from the same `packages/*` so colors, typography, and shared components stay in lockstep.

When adding cross-cutting changes (a new brand color, a button primitive, a tweak to dark-mode behavior), put them in `packages/*` so both apps pick them up — don't duplicate in each app.

## Layout

```
apps/
  landing/                  # Next.js 15, App Router, React 19 — main portfolio
  blog/                     # Astro 5 + React islands — blog
packages/
  tailwind-config/          # Shared Tailwind theme: colors, screens, fontSize, dropShadow, typography plugin
  ui/                       # Shared React components (ThemeToggle today)
  shared-config/            # Shared ESLint/Prettier dev deps
turbo.json                  # Turborepo task graph
package.json                # Yarn workspaces, root scripts
vercel.json                 # Root config — used by the landing Vercel project
```

## How sharing works

### Tailwind (design tokens)
- `packages/tailwind-config/index.js` is the **source of truth** for colors (`flat-blue`, `flat-orange`, `beige`, `dark-black`, custom `gray` scale, …), `screens`, `fontSize`, `dropShadow`, and registers `@tailwindcss/typography`.
- `packages/tailwind-config/components.css` holds shared component classes (`.btn`, `.card`, …) under `@layer components`.
- Both apps' `tailwind.config.js` import the shared config and **spread** `theme.extend` and `plugins` rather than redefining tokens:
  ```js
  const sharedConfig = require('@portfolio/tailwind-config');
  module.exports = {
    theme: { extend: { ...sharedConfig.theme.extend, /* app-specific extras */ } },
    plugins: [...sharedConfig.plugins],
  };
  ```
- Both apps `@import '@portfolio/tailwind-config/components.css'` (or `@source` it via Tailwind v4) so utility/component classes are identical.
- **Add a new color/token in `packages/tailwind-config/index.js`** — never in an app's local config.

### UI components (`packages/ui`)
- Plain React components, **presentational/headless** — no CSS exported. Consumers render them with their own Tailwind setup.
- Each consumer must include the package in its Tailwind `content` glob:
  ```
  '../../packages/ui/**/*.{js,ts,jsx,tsx}'
  ```
  Blog also `@source`s it from `src/styles/global.css`.
- Imported as `import { ThemeToggle } from 'ui';` in both apps.
- In Astro, mount via a React wrapper with `client:only="react"` (see `apps/blog/src/components/ThemeToggle.astro` → `ThemeToggleWrapper.tsx`). Don't render shared React components as static Astro children — they need hydration to be interactive.

### Dark mode (shared strategy)
Both apps use Tailwind's `class` dark mode and toggle the `dark` class on `<html>`, persisting to `localStorage.theme`. This keeps the same `dark:` utilities working in both.

- Landing: `next-themes` `<ThemeProvider attribute="class">` in `app/ClientLayout.tsx`.
- Blog: inline `<script is:inline>` in `BaseHead.astro` reads `localStorage.theme` / `prefers-color-scheme` to set the class pre-paint (avoids FOUC); the shared `ThemeToggle` writes back to `localStorage` and toggles the class.

If you change one app's theme contract (storage key, class name, attribute), change the other too.

### Typography
Landing uses `next/font` (Outfit, Paytone One) wired via CSS variables `--font-outfit` / `--font-paytone` and Tailwind `fontFamily`.
Blog uses self-hosted Atkinson woff in `apps/blog/public/fonts/`.
Prose styling for the blog is configured in `apps/blog/tailwind.config.js` under `typography` (light + invert) using shared color tokens — keep it expressed in tokens, not raw hex.

## Apps

### `apps/landing` (Next.js)
- Next.js 15 App Router, React 19, TypeScript.
- Path alias: `~/*` → `./src/*`.
- Analytics: Splitbee (rewrites in `next.config.js`).
- Security headers (CSP, HSTS, etc.) in `next.config.js`.
- Vercel root output: `apps/landing/.next` (see root `vercel.json`).

### `apps/blog` (Astro)
- Astro 5, content collections (`src/content/blog/**.{md,mdx}`) typed via Zod schema in `src/content.config.ts`.
- React integration enabled (`@astrojs/react`) for islands like the theme toggle.
- Output: `static` by default; Vercel adapter with web analytics. A `--node` flag in `astro.config.mjs` swaps to the Node adapter for `build:node`.
- Site URL: `https://blog.carnav.in`.
- Deploys as a **separate Vercel project** with `apps/blog/vercel.json` (`buildCommand` runs Turbo from repo root with `--filter=@portfolio/blog`).

## Scripts

Root (Turborepo runs the matching script in every workspace):
```
yarn dev          # all apps in dev
yarn build        # all apps for prod
yarn dev-blog     # one-off blog dev run (non-persistent)
yarn lint / lint:fix
yarn commit       # commitizen with cz-git (see cz.config.js)
```

Per-app:
```
yarn workspace @portfolio/landing dev
yarn workspace @portfolio/blog dev      # localhost:4321
yarn workspace @portfolio/blog build:node
```

## Conventions

- **Don't duplicate design tokens.** New color, breakpoint, font size → `packages/tailwind-config/index.js`.
- **Don't fork shared components.** If `ui/ThemeToggle` needs an app-specific behavior, extend it via props, not a copy.
- **Astro + shared React component → `client:only="react"` wrapper.** SSR'ing them through Astro's React renderer is fine for static markup, but anything reading `document` / `localStorage` belongs in a `client:only` island.
- **Keep dark-mode contract symmetric.** `class="dark"` on `<html>`, key `theme` in `localStorage`, values `"dark"` / `"light"`.
- **Commits use Commitizen** (`yarn commit`) — conventional commits with emojis, configured in `cz.config.js`.
- **Linting is per-app** (`apps/*/eslint.config.*` or `.eslintrc.json`); shared dev deps come from `@portfolio/shared-config`.

## Branching

Active development branch for the hybrid setup work: `claude/hybrid-nextjs-astro-setup-PAEtd`.
