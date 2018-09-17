const { readFileSync }  = require('fs');
const express           = require('express');
const { h }             = require('preact');
const render            = require('preact-render-to-string');
const fetch             = require('node-fetch-polyfill');
const bundle            = require('./build/ssr-build/ssr-bundle');

global.fetch = fetch;

const App = bundle.default;
const { defaultState, Helmet, configureStore, prefetchRoutes } = App;
const { PORT = 3001, NO_STATIC } = process.env;
const { style, scripts } = parseBuiltTemplate();
const assetsExtensions = [
  '.jpg',
  '.jpeg',
  '.css',
  '.png',
  '.ico',
  '.js',
  '.map',
  '.svg',
];
const app = express();

// Static assets should only be served by this file in development
// Cloudflare should take care of routing static assets requests to Netlify
if ( NO_STATIC !== 'false' ) {
  app.use((req, res, next) => {
    const isAsset = assetsExtensions.some((ext) =>
      req.url.toLowerCase().endsWith(ext)
    );

    if ( isAsset ) {
      return express.static('build')(req, res, next);
    }

    next();
  });
}

app.use((req, res, next) => {
  const store = configureStore(defaultState);

  prefetchRoutes(req.url, store.dispatch)
    .then(() => {
      const body = render(h(App, { url: req.url, store }));
      const helmet = Helmet.rewind();
      const state = JSON.stringify(store.getState()).replace(/</g, '\\u003c');

      const html = `
        <!doctype html>
        <html>
          <head ${helmet.htmlAttributes.toString()}>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            ${style}
          </head>
          <body>
            <div id="content">
              ${body}
            </div>
            <script>
              window.__STATE__ = ${state}
            </script>
            ${scripts}
            ${helmet.noscript.toString()}
          </body>
        </html>
      `;
      res.setHeader('Content-Type', 'text/html');
      res.end(html);

      return true;
    })
    .catch(e => {
      console.error(e);
      res.end('Request failed');
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function parseBuiltTemplate() {
  const template = readFileSync('build/index.html', 'utf8');
  const scriptsRgx = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
  const style = /<link href="(.*)" rel="stylesheet">/.exec(template)[0];
  const scripts = [];
  let out;

  while ((out = scriptsRgx.exec(template)) != null) {
    scripts.push(out[0]);
  }

  return { style, scripts: scripts.join('\n') };
}
