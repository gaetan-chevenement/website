const sirv = require('sirv');
const express = require('express');
const { h } = require('preact');
const { basename } = require('path');
const { readFileSync } = require('fs');
const compression = require('compression')();
const render = require('preact-render-to-string');
const bundle = require('./build/ssr-build/ssr-bundle');
const App = bundle.default;
const defaultState = App.defaultState;
const Helmet = App.Helmet;
const configureStore = App.configureStore;
const fetch = require('node-fetch-polyfill');

const { PORT=3000 } = process.env;

global.fetch = fetch;

// TODO: improve this?
const template = readFileSync('build/index.html', 'utf8');

function setHeaders(res, file) {
  let cache = basename(file) === 'sw.js' ? 'private,no-cache' : 'public,max-age=31536000,immutable';
  res.setHeader('Cache-Control', cache); // don't cache service worker file
}
const RGX = /<div id="app"[^>]*>.*?(?=<script)/i;

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

const scriptsRgx = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;

const app = express();
//app.use('/assets', express.static('build'));
app.use((req, res, next) => {
  const isAsset = assetsExtensions.filter(
    ext => req.url.toLowerCase().endsWith(ext)
  ).length > 0;

  if (isAsset) {
    console.log('asset', req.url);
    return express.static('build')(req, res, next);
  }
  console.log('page', req.url);

  const store = configureStore(defaultState);

  App.prefetchRoutes(req.url, store.dispatch)
    .then(() => {
      let body = render(h(App, {
        url: req.url,
        store,
      }));

      const head = Helmet.rewind();
      const style = template.match(/<link href="(.*)" rel="stylesheet">/)[1];
      let scripts = [], out;
      while ((out = scriptsRgx.exec(template)) != null) {
        scripts.push(out[0]);
      }
      const html = `
    <!doctype html>
    <html>
        <head ${head.htmlAttributes.toString()}>
            ${head.title.toString()}
            ${head.meta.toString()}
            ${head.link.toString()}
            <link href="${style}" rel="stylesheet">
        </head>
        <body>
            <div id="content">
                ${body}
                <script>
                    window.__STATE__ = ${JSON.stringify(store.getState()).replace(/</g, '\\u003c')}
                 </script>
                ${scripts.join('')}
            </div>
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


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});


