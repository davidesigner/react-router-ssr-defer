import type * as express from 'express';
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';

import { routes } from './index';

export async function render(request: express.Request): Promise<string> {
  const { query, dataRoutes } = createStaticHandler(routes);
  const remixRequest = createFetchRequest(request);
  const context = await query(remixRequest);

  if (context instanceof Response) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw context;
  }

  const router = createStaticRouter(dataRoutes, context);
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouterProvider router={router} context={context} nonce="the-nonce" />
    </React.StrictMode>,
  );
}

export function createFetchRequest(req: express.Request): Request {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const origin = `${req.protocol}://${req.get('host')}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const url = new URL(req.originalUrl || req.url, origin);

  const controller = new AbortController();
  req.on('close', () => {
    controller.abort();
  });

  const headers = new Headers();
  for (const [key, values] of Object.entries(req.headers)) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    signal: controller.signal,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body;
  }

  return new Request(url.href, init);
}
