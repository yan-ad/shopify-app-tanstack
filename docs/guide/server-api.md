# Server API

The server entrypoint exports the app factory and most runtime-facing primitives.

## Core export

`shopifyApp(appConfig)` is the main factory. It builds a runtime object with:

- `authenticate`: admin, webhook, public, POS, flow, fulfillment-service paths.
- `unauthenticated`: admin/storefront API client contexts.
- `registerWebhooks`: webhook registration utility.
- `addDocumentResponseHeaders`: response header helper.
- `sessionStorage`: active session backend.
- `login`: available for App Store and Single Merchant distributions.

## How `shopifyApp(...)` composes runtime

At a high level in `src/server/shopify-app.ts`:

1. `deriveApi(appConfig)` normalizes app URL and initializes Shopify API.
2. `deriveConfig(appConfig, api.config)` resolves auth paths, session config, and feature flags.
3. Auth strategy is chosen by distribution:
   - Shopify Admin: merchant custom auth strategy.
   - Others: token exchange strategy.
4. Concrete authentication handlers and contexts are assembled into the return object.

## App distributions

The code supports multiple distribution modes via `AppDistribution`, including App Store and Shopify Admin custom app behavior. This affects login availability and strategy selection.

## Boundary helpers

The `boundary` export from `src/server/boundary` provides helpers used to set response headers and handle error boundaries consistently for app routes.
