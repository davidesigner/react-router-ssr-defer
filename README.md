# POC SSR with Defer react-router

## Context

We are using the SSR config (from the official example https://github.com/remix-run/react-router/tree/dev/examples/ssr-data-router).

We want to use the defer function to display the page with required data & loaders, then hydrate the page with full content asap.

## Start the project

```shell
npm start
```

The page should display the content from the server side rendering in 5 secondes. 

Too long... Let's try to improve this by running the long API call asynchronously with hydratation.

## Reproduce the bug

Open the `src/Index.page.tsx` file and remove the `await` before the `api.getFullContent()` on the loader.

### Result

No content loaded.

### Expected result

This should display a loader then, the same result as the server side rendering (with the `await` before the `api.getFullContent()`).
