const path = require('path');
const fsp = require('fs/promises');
const express = require('express');
const { installGlobals } = require('@remix-run/node');

// Polyfill Web Fetch API
installGlobals();

const root = process.cwd();
const isProduction = process.env.NODE_ENV === 'production';
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

function resolve(p) {
  return path.resolve(__dirname, p);
}

async function createServer() {
  const app = express();
  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;

  if (!isProduction) {
    vite = await require('vite').createServer({
      root,
      server: {
        middlewareMode: true,
        host,
        hmr: {
          port: `2${port}`,
        },
      },
      appType: 'custom',
    });

    app.use(vite.middlewares);
  } else {
    app.use(require('compression')());
    app.use(express.static(resolve('dist/client')));
  }

  app.use('*', async (req, res) => {
    const url = req.originalUrl;

    try {
      let template;
      let render;

      if (!isProduction) {
        template = await fsp.readFile(resolve('index.html'), 'utf8');
        template = await vite.transformIndexHtml(url, template);
        render = await vite.ssrLoadModule('src/entry.server.tsx').then((m) => m.render);
      } else {
        template = await fsp.readFile(resolve('dist/client/index.html'), 'utf8');
        render = require(resolve('dist/server/entry.server.js')).render;
      }

      try {
        const appHtml = await render(req);
        const html = template.replace('<!--app-html-->', appHtml);
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).end(html);
      } catch (e) {
        if (e instanceof Response && e.status >= 300 && e.status <= 399) {
          return res.redirect(e.status, e.headers.get('Location'));
        }
        throw e;
      }
    } catch (error) {
      if (!isProduction) {
        vite.ssrFixStacktrace(error);
      }
      console.log(error.stack);
      res.status(500).end(error.stack);
    }
  });

  return app;
}

createServer().then((app) => {
  app.listen(port, () => {
    console.log('HTTP server is running at \x1b[36m%s\x1b[0m', `http://${host}:${port}`);
    require('openurl').open(`http://${host}:${port}`);
  });
});
