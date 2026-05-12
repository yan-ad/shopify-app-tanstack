# Project Structure

## Top-level layout

```text
src/
  react/
    components/
      AppProvider/
      AppProxyLink/
      AppProxyProvider/
  server/
    adapters/
    authenticate/
      admin/
      flow/
      fulfillment-service/
      login/
      pos/
      public/
      webhooks/
    boundary/
    clients/
      admin/
      storefront/
    helpers/
    unauthenticated/
```

## Server module map

- `src/server/index.ts`: public exports and API types.
- `src/server/shopify-app.ts`: creates the `shopifyApp(...)` runtime object.
- `src/server/config-types.ts`: app config type contracts.
- `src/server/types.ts`: app object and context type models.
- `src/server/errors.ts`: exported error classes/types.
- `src/server/boundary/`: response headers and error boundary helpers.
- `src/server/authenticate/`: all authentication paths and strategies.

## React module map

- `src/react/index.ts`: public React exports.
- `src/react/components/AppProvider/`: app provider wrapper for embedded and non-embedded shells.
- `src/react/components/AppProxyProvider/`: app proxy context/provider.
- `src/react/components/AppProxyLink/`: link helper for proxy routing.

## Tests

- `src/server/__tests__/`: server behavior tests.
- `src/react/components/**/__tests__/`: component behavior tests.
- `src/server/__test-helpers__/`: shared fixtures and assertions for server tests.
