# Nitro / TanStack Start SSR

This package can be used from TanStack Start apps that run on Nitro.

## Install

```sh
bun add @yan-ad/shopify-app-tanstack @tanstack/react-router
bun add -d nitro
```

## Runtime adapter

Import the Nitro adapter once from your server entry before creating the Shopify app. The adapter configures Shopify's Web API runtime for Nitro and keeps local `APP_BRIDGE_URL` overrides working during development.

```ts
// app/shopify.server.ts
import '@yan-ad/shopify-app-tanstack/server/adapters/nitro';

// Keep this import after the Nitro adapter. The adapter initializes Shopify's
// runtime hooks before shopifyApp calls into @shopify/shopify-api.
import {ApiVersion, shopifyApp} from '@yan-ad/shopify-app-tanstack/server';

export const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  apiVersion: ApiVersion.January25,
  appUrl: process.env.SHOPIFY_APP_URL!,
  scopes: process.env.SCOPES?.split(',')!,
  sessionStorage: /* your session storage */ undefined as never,
});

export const authenticate = shopify.authenticate;
```

## TanStack Start route usage

Use the Web Fetch `Request` object from TanStack Start server functions or route handlers and return standard `Response` values.

```ts
import {createServerFileRoute} from '@tanstack/react-start/server';

import {authenticate} from '~/shopify.server';

export const ServerRoute = createServerFileRoute('/api/shop').methods({
  GET: async ({request}) => {
    const {admin} = await authenticate.admin(request);
    const response = await admin.graphql(`{ shop { name } }`);

    return Response.json(await response.json());
  },
});
```

## Notes

- `nitro dev` / `nitro build` can bundle this package through the published ESM exports.
- Importing `@yan-ad/shopify-app-tanstack/server/adapters/nitro` is side-effectful and should happen before app initialization.
- Set `APP_BRIDGE_URL` only when you need to override Shopify App Bridge locally.
