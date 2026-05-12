# `@yanuaraditia/shopify-app-tanstack`

<!-- ![Build Status]() -->

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

This is a community-maintained project inspired by Shopify's app tooling, rebuilt for [TanStack Router](https://tanstack.com/router).

It is not an official Shopify package.

This package is built for the Vite ecosystem, making it easy to build Shopify apps with TanStack Router while keeping familiar Shopify app primitives.

## Getting started

Clone this repository and run:

```sh
bun install
bun run build
```

Then follow the API docs in this repository and adapt your app's entrypoints to TanStack Router.

## Migrating from Remix

Use the migration notes in this repository to move existing Shopify app routes/loaders/actions into TanStack Router patterns.

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
