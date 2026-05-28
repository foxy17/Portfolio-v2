# Project Details

Project-specific architecture, commands, and conventions for this repository.
Imported into [`CLAUDE.md`](../CLAUDE.md) so Claude Code always has this context.

## Commands

Yarn 1 + Turborepo. Node `>=22.12.0`. All commands run from repo root unless noted.

- `yarn install` — install workspace deps
- `yarn dev` — run all apps (`turbo run dev`); persistent
- `yarn dev-blog` — non-persistent variant for blog only
- `yarn build` — build everything
- `yarn build:node` — Astro blog with `--node` adapter (standalone) instead of Vercel adapter
- `yarn lint` / `yarn lint:fix`
- `yarn preview` — Astro preview
- `yarn commit` — Commitizen with `cz-git` (`cz.config.js`); use this instead of `git commit -m` for conventional commits with emoji

Per-app (run inside `apps/landing` or `apps/blog`): `yarn dev`, `yarn build`, `yarn lint`. Astro extras in `apps/blog`: `yarn astro …`.

No test runner configured.

## Architecture

Turborepo monorepo. Two independently deployed apps share a tiny UI package and Tailwind config.

### Workspaces
- `apps/landing` — Next.js 16 App Router, React 19. Deploys at root via `vercel.json` (`outputDirectory: ./apps/landing/.next`). Splitbee proxy rewrites + strict CSP/security headers in `next.config.js`. The `src/app/api/now-playing` route is a thin proxy to an external Spotify endpoint (`novatorem-sand.vercel.app`) — no Spotify creds needed locally.
- `apps/blog` — Astro 6 + `@astrojs/react` + MDX, `output: 'static'`. Deploys with `@astrojs/vercel` by default; switches to `@astrojs/node` when `--node` is passed (see `astro.config.mjs`). Has its own `apps/blog/vercel.json` that builds via `turbo --filter=@portfolio/blog`. Site is `https://blog.carnav.in`.
- `packages/ui` (`name: "ui"`, not scoped) — shared `ThemeToggle` component + `theme.ts` cookie/script utilities. Imported as `from 'ui'` in both apps.
- `packages/tailwind-config` (`@portfolio/tailwind-config`) — shared Tailwind v4 theme: `flat-*` palette, `beige`, custom `gray` scale, `dropShadow.card`, `screens.showSocial`. Each app's `tailwind.config.js` spreads `sharedConfig.theme.extend`. Landing also defines `font-paytone`/`sans` and custom keyframes. Blog adds extensive `typography` and `typography.invert` rules for prose.
- `packages/shared-config` — shared ESLint/Prettier devDeps.

### Cross-app theme sync (important)
Theme is shared across `landing` and `blog` via a `theme` cookie scoped to `.carnav.in`. Source of truth: `packages/ui/src/theme.ts`.

- Inline `themeInitScript` runs in `<head>` (landing's `app/layout.tsx`, blog's `BaseHead.astro`) to set `<html class="dark">` before paint, avoiding flash.
- `subscribeToThemeCookie(onChange, { pollMs })` polls every 2s and listens to `visibilitychange`/`focus`, so a toggle in one app propagates to the other tab when refocused.
- Landing wraps the tree in `ThemeProvider` (`src/lib/hooks/useTheme.tsx`) using `useTheme()`. Blog's React island `ThemeToggleWrapper.tsx` uses the cookie utils directly — no provider.
- Both apps use Tailwind `darkMode: 'class'`. When editing theme code, keep cookie domain logic (`.carnav.in`) and the inline init script in sync between `theme.ts` and any HTML head templates.

### Path aliases
- Landing uses `~/*` → `src/*` (see `apps/landing/tsconfig.json`).
- `ui` is a bare-specifier import (workspace package).

### Blog content
Posts live in `apps/blog/src/content/blog/*.md{,x}` and load via Astro's content collections (`apps/blog/src/content.config.ts`). Frontmatter is zod-validated: required `title`, `description`, `pubDate`; optional `updatedDate`, `heroImage`. To add a post, drop a new `.md` or `.mdx` file with valid frontmatter — no registration needed.

### Deployment
Root `vercel.json` builds and deploys **landing only** (`buildCommand: turbo run build`, `outputDirectory: ./apps/landing/.next`). Blog is a separate Vercel project pointing at `apps/blog/vercel.json`. Don't add the blog to the root `vercel.json` — they're intentionally separate projects.

### Analytics
Landing proxies Splitbee through `/sb.js` and `/sb-api/*` rewrites in `next.config.js` to dodge ad-blockers. Blog uses Vercel Web Analytics via the Vercel adapter.

## Conventions

- Commits: Conventional Commits via `yarn commit` (cz-git, emoji enabled, infinite header length).
- Plans / design notes live in `docs/plans/` (dated markdown).
- `apps/landing` has a husky `pre-commit` hook running `lint-staged` (`eslint --fix` on `**/*.js`); config in `apps/landing/package.json`.
