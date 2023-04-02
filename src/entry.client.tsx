import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, matchRoutes, RouterProvider } from 'react-router-dom';

import { routes } from './index';

void hydrate();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function hydrate() {
  // Determine if any of the initial routes are lazy
  const lazyMatches = matchRoutes(routes, window.location)?.filter(
    // @ts-expect-error TS2339: Property 'lazy' does not exist on type 'RouteObject'.
    (m) => m.route.lazy,
  );

  // Load the lazy matches and update the routes before creating your router,
  // so we can hydrate the SSR-rendered content synchronously.
  if (lazyMatches != null && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        // @ts-expect-error TS2339: Property 'lazy' does not exist on type 'RouteObject'.
        const routeModule = await m.route.lazy!(); // eslint-disable-line @typescript-eslint/no-non-null-assertion
        Object.assign(m.route, { ...routeModule, lazy: undefined });
      }),
    );
  }

  const router = createBrowserRouter(routes);

  const container = document.getElementById('root');
  if (container == null) {
    throw new Error('root element not found (the app cannot be hydrated properly).');
  }

  ReactDOM.hydrateRoot(
    container,
    <React.StrictMode>
      <RouterProvider router={router} fallbackElement={null} />
    </React.StrictMode>,
  );
}
