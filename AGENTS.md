# AGENTS.md

Repository guidance for coding agents working in this workspace.

## Current Working Tree Context

At the time this file was created, these paths were already untracked:

- `.claude/`
- `CLAUDE.md`
- `docs/`

Treat those as user-owned context. Do not delete, revert, rename, or fold them into unrelated edits unless the user explicitly asks.

## Commands

This is a Yarn 1 + Turborepo monorepo. Use Node `>=22.12.0`. Run commands from the repo root unless a task specifically targets one app.

- `yarn install` installs workspace dependencies.
- `yarn dev` runs all app dev servers through `turbo run dev`; this is persistent.
- `yarn dev-blog` runs the blog dev task in a non-persistent mode.
- `yarn build` builds all apps/packages.
- `yarn build:node` builds the Astro blog with the Node adapter.
- `yarn lint` runs lint across the monorepo.
- `yarn lint:fix` applies lint fixes.
- `yarn preview` runs Astro preview.
- `yarn commit` opens Commitizen with `cz-git`; prefer this over `git commit -m`.

Per-app commands can be run from `apps/landing` or `apps/blog`: `yarn dev`, `yarn build`, and `yarn lint`. Astro-specific commands in `apps/blog` are available through `yarn astro ...`.

No test runner is currently configured.

## Architecture

This repo contains two independently deployed apps that share a small UI package and Tailwind config.

- `apps/landing`: Next.js 16 App Router, React 19. Deployed from the root Vercel project. Splitbee is proxied through rewrites in `next.config.js`, and strict security headers are configured there. `src/app/api/now-playing` proxies to an external Spotify endpoint, so local Spotify credentials are not required.
- `apps/blog`: Astro 6 with React and MDX. It builds static output by default with the Vercel adapter, and switches to the Node adapter for `--node`. It has its own Vercel project/config.
- `packages/ui`: Shared `ThemeToggle` plus theme cookie/script utilities. Imported as `ui`.
- `packages/tailwind-config`: Shared Tailwind v4 theme extension used by both apps.
- `packages/shared-config`: Shared lint/format dev dependencies.

## Theme Sync

Theme behavior is shared across landing and blog through `packages/ui/src/theme.ts`.

- The `theme` cookie is scoped to `.carnav.in` in production-like hosts.
- `themeInitScript` is injected in landing `app/layout.tsx` and blog `BaseHead.astro` to set the dark class before paint.
- Both apps use Tailwind `darkMode: 'class'`.
- If theme behavior changes, keep cookie domain handling, the inline init script, and both app head integrations aligned.

## Paths And Content

- Landing uses the `~/*` TypeScript alias for `apps/landing/src/*`.
- The shared UI package is imported with the bare specifier `ui`.
- Blog posts live in `apps/blog/src/content/blog/*.md` or `*.mdx`.
- Blog frontmatter requires `title`, `description`, and `pubDate`; `updatedDate` and `heroImage` are optional.

## Deployment Notes

- Root `vercel.json` deploys the landing app only, with output at `./apps/landing/.next`.
- The blog is intentionally a separate Vercel project using `apps/blog/vercel.json`.
- Do not add the blog to the root Vercel config unless the user explicitly asks to change deployment topology.

## Conventions

- Keep edits scoped to the requested app/package.
- Prefer existing local patterns and shared packages over introducing new abstractions.
- Use `rg` for searching.
- Use `yarn lint` or the relevant per-app lint/build command for verification when practical.
- Plans and design notes belong in `docs/plans/` as dated Markdown.
- Be careful with untracked files and unrelated working-tree changes; assume they belong to the user.
