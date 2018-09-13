const { readFileSync }  = require('fs');
const express           = require('express');
const { h }             = require('preact');
const render            = require('preact-render-to-string');
const fetch             = require('node-fetch-polyfill');
const bundle            = require('./build/ssr-build/ssr-bundle');

global.fetch = fetch;

const App = bundle.default;
const { defaultState, Helmet, configureStore } = App;
const { PORT = 3001 } = process.env;
// TODO: improve this?
const template = readFileSync('build/index.html', 'utf8');
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
