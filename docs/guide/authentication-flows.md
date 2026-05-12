# Authentication Flows

Auth behavior lives in `src/server/authenticate` and is split by purpose.

## Flow categories

- `admin/`: admin session auth, token handling, and strategy orchestration.
- `login/`: login route behavior and redirects.
- `public/`: public route authentication helpers.
- `webhooks/`: webhook request verification and auth context.
- `pos/`: POS-specific auth helpers.
- `flow/`: generic flow auth handling.
- `fulfillment-service/`: fulfillment service auth path.

## Strategy selection

`shopifyApp(...)` picks auth strategy based on app distribution:

- Shopify Admin distribution: merchant custom app strategy.
- Other distributions: token exchange strategy.

## Practical guidance

- Put auth checks in each server loader/endpoint.
- Keep mutation endpoints authenticated independently of page loaders.
- Use webhook authentication helpers for all inbound webhook handlers.
