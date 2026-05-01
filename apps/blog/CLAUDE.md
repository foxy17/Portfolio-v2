# `apps/blog` — Astro Blog

The blog at `blog.carnav.in`. Static-first with React islands for the bits that need interactivity. Shares Tailwind tokens and the `ThemeToggle` component with the Next.js landing app.

## Stack

- **Astro 5** with `output: 'static'` (Vercel adapter; Node adapter swaps in for `build:node`).
- **`@astrojs/react`** integration — used only for islands (currently `ThemeToggleWrapper.tsx`).
- **`@astrojs/mdx`**, **`@astrojs/sitemap`**, **`@astrojs/rss`** — content + feeds.
- **Tailwind v4** via `@tailwindcss/vite`. `src/styles/global.css` does:
  ```css
  @import 'tailwindcss';
  @config "../../tailwind.config.js";
  @source "../../../../packages/ui/**/*.{ts,tsx}";
  ```
  The `@source` line is what makes the shared `ui/ThemeToggle` classes survive Tailwind's content scan.
- **Self-hosted Atkinson** font in `public/fonts/` (preloaded in `BaseHead.astro`).

## Layout

```
src/
  components/
    BaseHead.astro            # <head>: meta, theme pre-paint script, font preloads, OG/Twitter
    Header.astro              # nav + ThemeToggle
    HeaderLink.astro
    Footer.astro
    FormattedDate.astro
    ThemeToggle.astro         # mounts ThemeToggleWrapper with client:only="react"
    ThemeToggleWrapper.tsx    # React island that drives the shared ui/ThemeToggle
  content/
    blog/                     # *.md / *.mdx posts (loaded by content collection)
  content.config.ts           # Zod schema (title, description, pubDate, updatedDate?, heroImage?)
  layouts/BlogPost.astro      # Per-post shell: header, hero, prose article, footer
  pages/
    index.astro               # Post list (sorted by pubDate desc)
    [...slug].astro           # Per-post page → BlogPost layout
    about.astro
    rss.xml.js                # /rss.xml feed
  styles/global.css
  consts.ts                   # SITE_TITLE, SITE_DESCRIPTION
  utils/                      # (currently a legacy theme.js — not wired up)
```

Path alias: `ui` → `../../packages/ui` (see `tsconfig.json`). Import shared components as `import { ThemeToggle } from 'ui';`.

## Theme integration (must match landing)

The blog deliberately mirrors landing's dark-mode contract:
- Class on `<html>`: `dark`.
- `localStorage` key: `theme`, values `"dark"` / `"light"`.

Two pieces make it work:

1. **Pre-paint script** in `src/components/BaseHead.astro`:
   ```html
   <script is:inline>
     if (localStorage.getItem('theme') === 'dark' ||
         (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
       document.documentElement.classList.add('dark');
     } else {
       document.documentElement.classList.remove('dark');
     }
   </script>
   ```
   This runs before paint to avoid FOUC. Keep it inline in `<head>`.

2. **`ThemeToggleWrapper.tsx`** (`client:only="react"`) hydrates and writes back to `localStorage` + toggles the class on click. It renders the shared `ui/ThemeToggle` — don't reimplement the button here.

Don't render shared React components as static Astro children if they need `document` / `localStorage` / hooks — they need hydration. Use `client:only="react"` (or `client:load` if SSR is harmless).

## Tailwind specifics

`tailwind.config.js` spreads the shared theme and adds the `typography` config (DEFAULT + invert). All prose colors are looked up from shared tokens (`theme('colors.flat-blue')`, `theme('colors.beige')`, the custom `gray` scale, …) — **don't** reintroduce raw hex values; if a color is missing, add it to `packages/tailwind-config/index.js` first.

`darkMode: 'class'` is set explicitly to match landing.

## Content collections

`src/content.config.ts` defines a `blog` collection loaded via `glob` from `src/content/blog/**/*.{md,mdx}`. Frontmatter is type-checked against:

```ts
{
  title: string,
  description: string,
  pubDate: Date,            // coerced from string
  updatedDate?: Date,
  heroImage?: string,
}
```

To add a post: drop a `.md` or `.mdx` file in `src/content/blog/`. The slug is the file name; routing is handled by `pages/[...slug].astro` calling `getStaticPaths()` over the collection.

## Build modes

`astro.config.mjs` picks the adapter based on `process.argv`:
- Default → `@astrojs/vercel` (web analytics enabled).
- `astro build --node` → `@astrojs/node` standalone (used by `yarn build:node`).

If you add another adapter, follow the same pattern — don't hardcode one.

## Scripts

```
yarn workspace @portfolio/blog dev          # astro dev (localhost:4321)
yarn workspace @portfolio/blog build        # static + Vercel adapter
yarn workspace @portfolio/blog build:node   # Node standalone server
yarn workspace @portfolio/blog preview
yarn workspace @portfolio/blog astro ...    # Astro CLI passthrough
yarn workspace @portfolio/blog lint
```

Root shortcut: `yarn dev-blog` (non-persistent, useful for one-off runs without spinning up landing).

## Deploy

Separate Vercel project. `apps/blog/vercel.json`:

```json
{
  "buildCommand": "cd ../.. && npx turbo run build --filter=@portfolio/blog",
  "outputDirectory": "dist",
  "installCommand": "cd ../.. && yarn install",
  "framework": "astro",
  "cleanUrls": true,
  "trailingSlash": false
}
```

In the Vercel project settings, set the root directory to `apps/blog` — the build command climbs back to the monorepo root so Turbo can resolve `packages/*`.

`site` in `astro.config.mjs` is `https://blog.carnav.in`; update it if the host changes (it's used for canonical URLs, sitemap, and RSS `link`s).
