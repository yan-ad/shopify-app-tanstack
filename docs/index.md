---
layout: home

hero:
  name: Shopify App TanStack
  text: Shopify app primitives rebuilt for TanStack Router
  tagline: A community-maintained toolkit for authentication, webhooks, API clients, and embedded React app wiring in Vite-based Shopify apps.
  actions:
    - theme: brand
      text: Explore the Architecture
      link: /guide/overview
    - theme: alt
      text: Migration Guide
      link: /guide/migration
    - theme: alt
      text: GitHub
      link: https://github.com/yanuaraditia/shopify-app-tanstack

features:
  - icon: 🧩
    title: Familiar Shopify Server Primitives
    details: Keep a familiar `shopifyApp(...)` setup with authentication, session handling, webhook verification, and unauthenticated API contexts.
  - icon: ⚡
    title: TanStack Router-Friendly Runtime
    details: Built to pair with TanStack Router patterns while preserving Shopify app behavior for embedded and public routes.
  - icon: 🛡️
    title: Complete Auth Flow Coverage
    details: Includes admin auth, public routes, POS, flow auth, fulfillment-service auth, and webhooks under a single server API surface.
  - icon: 🧪
    title: Test Helper Support
    details: Comes with test helper exports and repository-level fixtures to make integration and e2e testing more straightforward.
  - icon: 🧭
    title: Clear Module Boundaries
    details: Server and React modules are split intentionally to prevent cross-boundary imports and keep bundle behavior predictable.
  - icon: 📦
    title: Vite Ecosystem First
    details: Works naturally in Vite workflows, with typed exports for server, react, and test-helper entrypoints.
---

## Quick start

```sh
bun add @yanuaraditia/shopify-app-tanstack @tanstack/react-router
```

```ts
import {shopifyApp} from '@yanuaraditia/shopify-app-tanstack/server';

export const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: process.env.SCOPES?.split(',')!,
  appUrl: process.env.SHOPIFY_APP_URL!,
  sessionStorage: /* your session storage */ undefined as never,
});
```

## Learn the codebase

- [Overview](/guide/overview)
- [Project Structure](/guide/project-structure)
- [Server API](/guide/server-api)
- [React API](/guide/react-api)
- [Authentication Flows](/guide/authentication-flows)
- [Testing](/guide/testing)

## Local docs development

```sh
bun docs:dev
```

```sh
bun docs:dev -- --port 3030
```
