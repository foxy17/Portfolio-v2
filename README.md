# Portfolio Monorepo

This monorepo contains all the packages related to my portfolio website.

## What's inside?

This monorepo uses [Turborepo](https://turbo.build/) and contains:

### Apps and Packages

- `landing`: A [Next.js](https://nextjs.org) app for the main portfolio site
- `packages/*`: Any shared packages used across the monorepo

### Utilities

This monorepo has some additional tools:

- [Turborepo](https://turbo.build/) for builds, development, and deployment
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Getting Started

### Development

To develop all apps and packages:

```bash
yarn install
yarn dev
```

### Build

To build all apps and packages:

```bash
yarn build
```

### Deployment

The monorepo is configured for deployment on Vercel. 