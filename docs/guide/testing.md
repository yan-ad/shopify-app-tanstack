# Testing

The project uses Vitest and includes extensive server-side test helpers.

## Test locations

- `src/server/__tests__/`
- `src/react/components/**/__tests__/`
- `src/server/__test-helpers__/`

## Library helper for downstream apps

Consumers can use `testConfig()` from `@yan-ad/shopify-app-tanstack/test-helpers` to simplify local app test setup.

Typical usage:

- Override config when `SHOPIFY_TESTING` is enabled.
- Optionally pass a concrete `sessionStorage` to `testConfig(...)` for e2e/integration scenarios.

## Useful commands

```sh
bun run test
bun run test:ci
```
