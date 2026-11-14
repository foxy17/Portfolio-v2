---
title: 'Why everyone is talking about Astro and Island Architecture'
description: 'A 2026 refresh of the case for Astro: zero-JS by default, partial hydration, and the island architecture pattern that makes content sites fast again.'
pubDate: '2026-05-05'
heroImage: '../../assets/blog/why-everyone-is-talking-about-astro/astro-island-architecture-hero.webp'
tags: ['astro', 'web-performance', 'frontend', 'island-architecture']
category: 'engineering'
---

I first wrote a version of this post back in 2022 when Astro was new and most people building portfolio sites still reached for Next.js out of habit. Four years on, Astro has shipped six major versions, the Vercel team has stopped recommending Edge runtimes, and "ship less JavaScript" has gone from a niche opinion to platform default. Time for a refresh.

## The problem: framework JavaScript on pages that don't need it

Open the network tab on most static-rendered Next.js sites — a marketing page, a docs site, a blog — and you'll usually find 100–300 KB of JavaScript shipped just so React can render markup the server already produced. The hydration script re-runs every component on the client to attach event handlers that, on a content page, almost never fire.

Lighthouse calls out unused JavaScript as one of the most expensive things you can do to your **Time to Interactive** and **INP** numbers. The frustrating part is the JS isn't *broken* — it's just unnecessary on pages that don't have meaningful interactivity. You're paying the framework tax even when you're not using the framework.

## Astro's pitch: zero JS by default

Astro flips the default. Each route is a static HTML page. No client-side router, no hydration runtime, no React reconciler. By default, the JavaScript bundle for a page is **literally zero bytes**.

You still write components — `.astro`, React, Vue, Svelte, Solid, Preact — but they render server-side and ship as plain HTML. The framework strips away the framework.

```astro
---
// src/pages/index.astro
import Header from '../components/Header.astro';
import PostList from '../components/PostList.astro';
const posts = await getCollection('blog');
---

<html>
  <head><title>Home</title></head>
  <body>
    <Header />
    <PostList posts={posts} />
  </body>
</html>
```

That page ships zero JavaScript. The components compile to HTML at build time. You only pay for what you use.

## Partial hydration via islands

The interesting question is what happens when you *do* need interactivity — a search input, a theme toggle, an image carousel. Astro's answer is **island architecture**: hydrate only the components that need to be interactive, and treat each as an isolated island in a sea of static HTML.

You opt in per-component with a `client:` directive:

```astro
---
import Search from '../components/Search.tsx';
import ThemeToggle from '../components/ThemeToggle.tsx';
---

<!-- Hydrates immediately on load -->
<Search client:load />

<!-- Hydrates when the browser is idle -->
<ThemeToggle client:idle />

<!-- Hydrates only when scrolled into view -->
<Comments client:visible />

<!-- Hydrates only when a media query matches -->
<MobileMenu client:media="(max-width: 768px)" />
```

Each island ships *only its own* JavaScript and *only its own* framework runtime. The rest of the page stays static HTML. A failure or perf regression in one island can't drag down the rest of the page — they're independent.

This is the part most people miss when they first hear "island architecture." It isn't just lazy hydration. It's that the unit of hydration is a component, not a page. You can have a React component, a Svelte component, and a Solid component on the same page, each hydrating independently, with no shared client-side runtime competing for the main thread.

## What's changed since 2022

Three things make Astro a much easier sell today than it was when the original post went out:

1. **Astro's own image and font handling has caught up.** `astro:assets` does AVIF/WebP responsive images out of the box. Tailwind v4 + the Vite plugin handles CSS without PostCSS plumbing. You no longer have to BYO every optimization.
2. **`<ClientRouter />` brought View Transitions** to static sites. You get SPA-feel navigation — preserved scroll position, animated transitions, no full-page reload — without giving up the zero-JS-per-page model. The router itself is tiny.
3. **The "ship less JS" argument won.** Next.js added the App Router with Server Components. Vercel walked back its Edge-by-default stance. The whole industry quietly conceded that hydrating an entire React tree on every static page was a mistake. Astro just got there first and built the whole framework around the assumption.

## When to reach for it

Astro is the right tool when the page is **content-first**: a blog, marketing site, docs, landing page, portfolio, newsletter archive. Anywhere the user spends most of their time *reading*, not *interacting*.

It is *not* the right tool for app shells — dashboards, multi-step product flows, anything where the page is mostly stateful UI. For those, a real client-side framework still makes sense. Astro doesn't pretend otherwise; that's what its `client:` escape hatches and "use any framework you want for islands" model exist for.

The mental model that finally clicked for me: **most websites don't need to be applications**. Astro lets you build websites that are websites again, and only reaches for application machinery in the few specific places it's actually needed.

That's it. The rest is the usual stuff — pick your preferred component framework, write Markdown for content, deploy to Vercel or wherever. The opinionated part — *how much JS to ship* — is decided for you, in your favor, by default.
