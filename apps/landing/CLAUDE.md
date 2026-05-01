# `apps/landing` — Next.js Portfolio

The main portfolio site at `/`. Ships with the App Router, React 19, and the shared design system from `packages/*`.

## Stack

- **Next.js 15** (App Router), **React 19**, TypeScript.
- **Tailwind v4** via `@tailwindcss/postcss`. `src/styles/globals.css` does:
  ```css
  @import 'tailwindcss';
  @import '@portfolio/tailwind-config/components.css';
  @config '../../tailwind.config.js';
  ```
- **next-themes** for dark mode (`<ThemeProvider attribute="class">` in `app/ClientLayout.tsx`).
- **next/font** for Outfit + Paytone One — wired through CSS variables `--font-outfit` / `--font-paytone` (set in `app/layout.tsx`) and consumed in `tailwind.config.js` under `fontFamily`.
- **SWR + motion + react-icons + rough-notation + next-seo** as the main runtime libs.
- **Splitbee** analytics, proxied through `/sb.js` and `/sb-api/:slug` rewrites in `next.config.js` to dodge blockers.

## Layout

```
src/
  app/
    layout.tsx            # <html>, fonts, favicons, <ClientLayout>
    ClientLayout.tsx      # 'use client' — next-themes + Splitbee init
    page.tsx              # Home → NavContainer + Banner + FeaturedPosts + SocialsLine
    not-found.tsx
    api/now-playing/      # Spotify "now playing" proxy (consumed by SWR)
  components/
    Layout/               # NavContainer, NavItem, footer
    Cards/                # BlogPostCard, ProfileCard, PenSvg
    MobileMenu/           # MobileMenu.tsx + .module.css
    SocialLine/           # SocialLine.tsx + .module.css
    Banner.tsx, FeaturedPosts.tsx, NowPlaying.tsx, ExternalLink.tsx, WordWrapper.tsx
  config/constants.ts     # baseUrl, etc.
  data/                   # seo.ts, featuredPosts.ts, api/base.ts
  lib/                    # fetcher, hooks (useIsMounted, useDelayedRender, userArticles), spotify, types
  styles/globals.css
```

Path alias: `~/*` → `./*` and `./src/*` (see `tsconfig.json`). Prefer `~/components/...`, `~/lib/...`.

## Theme integration

- `ClientLayout` mounts `next-themes`'s `ThemeProvider` with `attribute="class"`, which toggles `class="dark"` on `<html>` and persists to `localStorage.theme`. **Don't change the storage key or attribute** — the blog reads/writes the same contract.
- `components/Layout/NavContainer.tsx` is the only place that drives the toggle. It reads `resolvedTheme` from `useTheme()` and renders the shared `<ThemeToggle />` from `ui`:
  ```tsx
  <ThemeToggle isDark={resolvedTheme === 'dark'} onToggle={handleToggle} />
  ```
- Wrap any `useTheme`-derived UI in an `isMounted` guard (see `useIsMounted`) to avoid hydration mismatch — `next-themes` resolves the theme client-side.

## Tailwind specifics

`tailwind.config.js` spreads the shared theme and adds Next-only extras:
- `fontFamily.paytone` / `fontFamily.sans` bound to the `next/font` CSS vars.
- `keyframes` + `animation` (`rectilinear`, `wave`).

When you need a new color or spacing token, add it to `packages/tailwind-config/index.js`, **not** here. Local extends are reserved for things genuinely specific to landing (font vars, animations).

## Routing & data

- App Router only — no `pages/` directory. New routes go under `src/app/<route>/page.tsx`.
- `'use client'` for anything using hooks, Splitbee, motion, or theme.
- `src/app/api/now-playing/route.ts` proxies a Spotify "now playing" endpoint (`src/lib/spotify.ts` → `https://novatorem-sand.vercel.app/api/data`); the UI in `components/NowPlaying.tsx` consumes it via SWR at `/api/now-playing`.
- SEO: default `metadata` is exported from `src/data/seo.ts` and applied per page (e.g. `app/page.tsx` re-exports it).

## Security headers

Defined in `next.config.js#securityHeaders` and applied to `/(.*)`:
CSP, Referrer-Policy, X-Frame-Options, X-Content-Type-Options, X-DNS-Prefetch-Control, HSTS (1 year + preload), Permissions-Policy (opts out of FLoC). Update the CSP allowlist there if you add new third-party origins.

## Scripts

```
yarn workspace @portfolio/landing dev      # next dev (localhost:3000)
yarn workspace @portfolio/landing build    # next build
yarn workspace @portfolio/landing start
yarn workspace @portfolio/landing lint     # eslint . (eslint-config-next)
```

## Deploy

The **root** `vercel.json` is the landing project's config:
```
buildCommand: turbo run build
outputDirectory: ./apps/landing/.next
```
Deployed at the apex domain. The blog has its own Vercel project (see `apps/blog/CLAUDE.md`).
