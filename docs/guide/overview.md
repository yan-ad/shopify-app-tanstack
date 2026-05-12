# Overview

@yanuaraditia/shopify-app-tanstack is a library package that ports Shopify app primitives to a TanStack Router-oriented setup.

## Goals

- Keep the familiar Shopify server API shape around `shopifyApp(...)`.
- Provide React helpers for embedded app rendering and App Bridge wiring.
- Stay framework-light and Vite-friendly.

## Main module surfaces

- `.../server`: server-side auth, session, webhook, and context helpers.
- `.../react`: React components for app shell and provider wiring.
- `.../test-helpers`: helpers such as `testConfig()` to simplify tests.

## Where to start in source

- `src/server/shopify-app.ts`: app factory and runtime config derivation.
- `src/server/authenticate/`: auth flows and route-specific authentication.
- `src/server/unauthenticated/`: admin/storefront unauthenticated clients.
- `src/react/components/`: UI-side provider and link helpers.

## Build and quality

- Build: `bun run build`
- Test: `bun run test`
- Lint: `bun run lint`
