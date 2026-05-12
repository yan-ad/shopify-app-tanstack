# `@yanuaraditia/shopify-app-tanstack`

<!-- ![Build Status]() -->

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![npm version](https://img.shields.io/npm/v/%40yanuaraditia%2Fshopify-app-tanstack?label=npm)](https://www.npmjs.com/package/@yanuaraditia/shopify-app-tanstack)
[![npm downloads](https://img.shields.io/npm/dm/%40yanuaraditia%2Fshopify-app-tanstack?label=downloads)](https://www.npmjs.com/package/@yanuaraditia/shopify-app-tanstack)

This is a community-maintained project inspired by Shopify's app tooling, rebuilt for [TanStack Router](https://tanstack.com/router).

It is not an official Shopify package.

This package is built for the Vite ecosystem, making it easy to build Shopify apps with TanStack Router while keeping familiar Shopify app primitives.

## Migration guide: `@shopify/shopify-app-react-router` -> `@yanuaraditia/shopify-app-tanstack`

The full migration guide now lives in this repository Wiki:

- https://github.com/yanuaraditia/shopify-app-tanstack/wiki/Migration-from-shopify%E2%80%90app%E2%80%90react%E2%80%90router

> [!WARNING]
> If your current project started from a **Remix template** (for example `shopify-app-template-remix`), read this official guide first:
> https://github.com/Shopify/shopify-app-template-react-router/wiki/Upgrading-from-Remix

## Package and release info

- npm: https://www.npmjs.com/package/@yanuaraditia/shopify-app-tanstack
- Install with bun: bun add @yanuaraditia/shopify-app-tanstack @tanstack/react-router
- Install with npm: npm install @yanuaraditia/shopify-app-tanstack @tanstack/react-router

This repository uses changelogen to generate and maintain `CHANGELOG.md` from Conventional Commits.

Common commands:

- bun run changelog (update `CHANGELOG.md` from commits)
- bun run changelog:bump (bump version and update `CHANGELOG.md`)
- bun run release (build, bump, changelog, commit, and tag)

## Resources

Getting started:

- [TanStack Router docs](https://tanstack.com/router/latest)
- [Vite docs](https://vite.dev/guide/)
- [Build a Shopify app](https://shopify.dev/docs/apps/build/build)
- [Project repository](https://github.com/yanuaraditia/shopify-app-tanstack)

Shopify:

- [Intro to Shopify apps](https://shopify.dev/docs/apps/getting-started)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [Shopify App Bridge](https://shopify.dev/docs/api/app-bridge-library).
- [Polaris Web Components](https://shopify.dev/docs/api/app-home/using-polaris-components).
- [App extensions](https://shopify.dev/docs/apps/app-extensions/list)
- [Shopify Functions](https://shopify.dev/docs/api/functions)

## Testing your app

This package exports a helper method through `@yanuaraditia/shopify-app-tanstack/test-helpers` to simplify testing: `testConfig()`. This method can be used to pass dummy configuration properties to `shopifyApp()`.

If your testing framework supports setting environment variables, we recommend using an environment variable, for example "SHOPIFY_TESTING" to replace your default config with the config returned from `testConfig()`.

```ts
// my-app/app/shopify.server.ts
import { testConfig } from "@yanuaraditia/shopify-app-tanstack/test-helpers";
...
const config = {
  ...
};

if (process.env.SHOPIFY_TESTING) {
  Object.assign(config, testConfig());
}

const shopify = shopifyApp(config);
...
```

`testConfig()` accepts a config object as an optional parameter. The config values provided override the default config values returned by `testConfig()`. This is especially useful for integration testing and end-to-end testing to ensure `shopifyApp()` reads the sessions from the development database.

```ts
// my-app/app/shopify.server.ts
import { testConfig } from "@yanuaraditia/shopify-app-tanstack/test-helpers";
...
const sessionStorage = new PrismaSessionStorage(prisma);
const config = {
  ...
  sessionStorage,
  ...
};

if (process.env.SHOPIFY_TESTING) {
  Object.assign(config, testConfig());
}

if (process.env.SHOPIFY_TESTING === "e2e") {
  Object.assign(config, testConfig({ sessionStorage }));
}
...
```

## Gotchas / Troubleshooting

For common issues, open or search issues in this repository: https://github.com/yanuaraditia/shopify-app-tanstack/issues
