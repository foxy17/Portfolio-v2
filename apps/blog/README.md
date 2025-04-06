# Astro Starter Kit: Blog

A blog built with [Astro](https://astro.build/) that's part of the portfolio monorepo.

## Development

To run this locally:

```bash
# From the monorepo root:
yarn dev # Runs all packages
# OR
yarn workspace @portfolio/blog dev # Runs just the blog
```

## Deployment

This package is set up to deploy as a separate Vercel project. The `vercel.json` file contains the necessary configuration to:

1. Build the project with Turborepo from the monorepo root
2. Output the static files from the dist directory
3. Configure clean URLs and trailing slash behavior

### Setting up on Vercel

1. Create a new project in Vercel
2. Link to your repository
3. Set the root directory to `packages/blog`
4. Vercel will automatically detect the framework as Astro
5. The build, install commands and output directory are already configured in `vercel.json`
6. Set environment variables as needed in the Vercel dashboard

## Commands

All commands are run from the root of the project, from a terminal:

| Command                            | Action                                           |
| :--------------------------------- | :----------------------------------------------- |
| `yarn workspace @portfolio/blog dev`        | Starts local dev server at `localhost:4321`      |
| `yarn workspace @portfolio/blog build`      | Build your production site to `./dist/`          |
| `yarn workspace @portfolio/blog preview`    | Preview your build locally, before deploying     |
| `yarn workspace @portfolio/blog astro ...`  | Run CLI commands like `astro add`                |
| `yarn workspace @portfolio/blog lint`       | Run linting                                      |

```sh
yarn create astro@latest -- --template blog
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/blog)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/blog)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/blog/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![blog](https://github.com/withastro/astro/assets/2244813/ff10799f-a816-4703-b967-c78997e8323d)

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
