# React API

The React entrypoint re-exports components from `src/react/components`.

## AppProvider

`AppProvider` is the main wrapper for route trees:

- Embedded admin UI: use with `embedded` and `apiKey`.
- Public or login routes: set `embedded={false}`.
- Optional TanStack Router Devtools can be passed via provider props in your app shell.

## AppProxyProvider and AppProxyLink

- `AppProxyProvider` provides app proxy context to child components.
- `AppProxyLink` helps generate app-proxy-safe links in React UI.

## Usage pattern

Create a top-level shell component that wraps route UI in `AppProvider`, then keep all Shopify embedded pages inside that provider boundary.
