---
name: blog-ai-seo-policy
description: Blog's deliberate AI-crawler policy and AI-search SEO setup (robots.txt + JSON-LD)
metadata:
  type: project
---

The blog (`apps/blog`, blog.carnav.in) intentionally **allows AI search/retrieval bots** (OAI-SearchBot, PerplexityBot, Claude-SearchBot, Applebot-Extended) while **blocking AI training bots** (GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider, etc.) in `public/robots.txt`.

**Why:** Goal is max discoverability in AI search results without donating content to model training.

**How to apply:** Do NOT suggest unblocking Google-Extended to "improve Google AI ranking" — Google AI Overviews are powered by the standard Googlebot index (allowed), NOT Google-Extended. Google-Extended only gates Gemini/Vertex training & grounding. So the current policy already maximizes AI-search presence. Keep training bots blocked unless the user explicitly opts into training.

AI-search structured data lives in `components/JsonLd.astro` (Person w/ jobTitle+knowsAbout, WebSite, BlogPosting w/ wordCount/timeRequired/articleSection, BreadcrumbList), plus a `Blog` catalog on `index.astro`, `CollectionPage` on `tags/[tag].astro`, and `pages/llms.txt.ts`. wordCount/category thread from `[...slug].astro` → BlogPost → BaseHead → JsonLd.
