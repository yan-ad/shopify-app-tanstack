# `@yanuaraditia/shopify-app-tanstack`

<!-- ![Build Status]() -->

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![npm version](https://img.shields.io/npm/v/%40yanuaraditia%2Fshopify-app-tanstack?label=npm)](https://www.npmjs.com/package/@yanuaraditia/shopify-app-tanstack)
[![npm downloads](https://img.shields.io/npm/dm/%40yanuaraditia%2Fshopify-app-tanstack?label=downloads)](https://www.npmjs.com/package/@yanuaraditia/shopify-app-tanstack)

This is a community-maintained project inspired by Shopify's app tooling, rebuilt for [TanStack Router](https://tanstack.com/router).

It is not an official Shopify package.

This package is built for the Vite ecosystem, making it easy to build Shopify apps with TanStack Router while keeping familiar Shopify app primitives.

## npm package

- npm: https://www.npmjs.com/package/@yanuaraditia/shopify-app-tanstack
- Install with bun: bun add @yanuaraditia/shopify-app-tanstack @tanstack/react-router
- Install with npm: npm install @yanuaraditia/shopify-app-tanstack @tanstack/react-router

## Getting started

Clone this repository and run:

```sh
bun install
bun run build
```

Then follow the API docs in this repository and adapt your app's entrypoints to TanStack Router.

## Changelog and releases

This repository uses changelogen to generate and maintain CHANGELOG.md from Conventional Commits.

Common commands:

- bun run changelog (update CHANGELOG.md from commits)
- bun run changelog:bump (bump version and update CHANGELOG.md)
- bun run release (build, bump, changelog, commit, and tag)

## Migrating from React Router

If your app currently uses `@shopify/shopify-app-react-router`, use this checklist to migrate directly to `@yanuaraditia/shopify-app-tanstack`.

> [!WARNING]
> If your current project started from a **Remix template** (for example `shopify-app-template-remix`), read this official guide first before using the steps below:
> https://github.com/Shopify/shopify-app-template-react-router/wiki/Upgrading-from-Remix
>
> This README assumes your app is already on the React Router template baseline.

### 0. Ensure your `shopify.web.toml` matches React Router runtime

If your app still has Remix-oriented process config, update `shopify.web.toml`:

```toml
name = "remix"
roles = ["frontend", "backend"]
webhooks_path = "/webhooks/app/uninstalled"

[commands]
predev = "bunx prisma generate"
dev = "bunx prisma migrate deploy && bun react-router dev"
```

### 1. Replace package dependencies

```diff
- bun remove @shopify/shopify-app-react-router
+ bun add @yanuaraditia/shopify-app-tanstack @tanstack/react-router
```

Or update `package.json` directly:

```diff
  "dependencies": {
-   "@shopify/shopify-app-react-router": "^x.y.z",
+   "@yanuaraditia/shopify-app-tanstack": "^1.0.0",
+   "@tanstack/react-router": "^1.x",
  }
```

If your app uses Polaris web component types, keep or add:

```sh
bun add -d @shopify/app-bridge-ui-types
```

`package.json` alternative:

```diff
  "devDependencies": {
+   "@shopify/app-bridge-ui-types": "^0.2.1"
  }
```

### 2. Update server imports

In your server bootstrap (for example `app/shopify.server.ts`), replace React Router package imports with TanStack package imports.

```diff
- import "@shopify/shopify-app-react-router/adapters/node";
- import {shopifyApp, ApiVersion, AppDistribution} from "@shopify/shopify-app-react-router/server";
+ import "@yanuaraditia/shopify-app-tanstack/adapters/node";
+ import {shopifyApp, ApiVersion, AppDistribution} from "@yanuaraditia/shopify-app-tanstack/server";
```

If you use boundary headers, update those imports too:

```diff
- import {boundary} from "@shopify/shopify-app-react-router/server";
+ import {boundary} from "@yanuaraditia/shopify-app-tanstack/server";
```

### 3. Wrap protected UI routes with the new AppProvider

For embedded admin routes, use `AppProvider` from this package's React entrypoint:

```tsx
import {AppProvider} from '@yanuaraditia/shopify-app-tanstack/react';

export function AppShell({
  apiKey,
  children,
}: {
  apiKey: string;
  children: React.ReactNode;
}) {
  return (
    <AppProvider embedded apiKey={apiKey}>
      {children}
    </AppProvider>
  );
}
```

For non-embedded routes (like login), disable embedding explicitly:

```tsx
import {AppProvider} from '@yanuaraditia/shopify-app-tanstack/react';

export function PublicShell({children}: {children: React.ReactNode}) {
  return <AppProvider embedded={false}>{children}</AppProvider>;
}
```

If you want TanStack Devtools inside the same shell, pass it through `routerDevtools` (opt-in):

```tsx
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools';
import {AppProvider} from '@yanuaraditia/shopify-app-tanstack/react';

export function AppShell({
  apiKey,
  children,
}: {
  apiKey: string;
  children: React.ReactNode;
}) {
  return (
    <AppProvider
      embedded
      apiKey={apiKey}
      routerDevtools={<TanStackRouterDevtools position="bottom-right" />}
    >
      {children}
    </AppProvider>
  );
}
```

You can keep it wired and disable it when needed:

```tsx
<AppProvider
  embedded
  apiKey={apiKey}
  routerDevtools={<TanStackRouterDevtools position="bottom-right" />}
  enableRouterDevtools={false}
>
  {children}
</AppProvider>
```

### 4. Move route definitions to TanStack Router

This package expects TanStack Router runtime patterns, so migrate React Router loaders/actions/components to TanStack Router route files.

At a minimum:

- Replace React Router route declarations with TanStack file-route or route-tree setup.
- Keep your existing `authenticate.admin(request)` logic in route loaders.
- Continue returning `apiKey` from protected route loaders and pass it to `AppProvider embedded apiKey={...}`.

### 5. Migrate route loaders and actions

TanStack Router does not use React Router `action` in the same way, so you should split route logic like this:

- Use `loader` for reads and initial data fetching.
- Use server endpoints (or RPC handlers) for writes/mutations that were previously in React Router `action`.
- Use TanStack Router navigation + invalidation patterns after mutations.

Example migration pattern:

```diff
+ import {createFileRoute} from '@tanstack/react-router';

- export const loader = async ({request}) => {
+ export const Route = createFileRoute('/products')({
+   loader: async ({context}) => {
+     const {request, authenticate} = context;
      await authenticate.admin(request);
      return {products: await loadProducts()};
- };
+   },
+   component: ProductsPage,
+ });

- export const action = async ({request}) => {
+ async function createProductEndpoint(request: Request) {
      await authenticate.admin(request);
      const form = await request.formData();
      await createProduct(form);
      return {ok: true};
  };
```

For each migrated route:

- Move `loader` logic into `createFileRoute(...){ loader }`.
- Move `action` logic into a server endpoint and call it from your form submit handler.
- Keep auth checks in both loader and mutation path.
- Revalidate route data after successful mutation.

### 6. Update app entry and navigation usage

- Replace React Router navigation hooks/components usage with TanStack Router equivalents (`useNavigate`, `Link`, and route APIs from `@tanstack/react-router`).
- Ensure embedded app navigation still flows through App Bridge events by rendering pages inside this package's `AppProvider`.

### 7. Validate locally

```sh
bun run build
bun run test
```

If your app fails after migration, start by checking:

- Any remaining imports from `@shopify/shopify-app-react-router`
- Missing TanStack Router route registration
- Routes that use `authenticate.admin(request)` but do not pass `apiKey` to `AppProvider`

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
