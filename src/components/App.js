import { h, Component } from 'preact';
import { Router }       from 'preact-router';
import Match            from 'preact-router/match';
import { Provider }     from 'react-redux';
import autobind         from 'autobind-decorator';
// import { ThemeProvider } from 'react-css-themr';

import Services         from 'async!../routes/Services';
import Process          from 'async!../routes/Process';
import About            from 'async!../routes/About';
import Contact          from 'async!../routes/Contact';
import Room             from '~/routes/Room';
import Home             from '~/routes/Home';
import Search           from '~/routes/Search';
import BookingForm      from '~/routes/BookingForm';
import BookingSummary   from '~/routes/BookingSummary';
import BookingConfirmed from '~/routes/BookingConfirmed';
import Payment          from '~/routes/Payment';
import Invoice          from '~/routes/Invoice';
import {
  updateRoute,
}                       from '~/actions';
import Utils            from '~/utils';
import Header           from './Header';
import Footer           from './Footer';
import NotFound         from '~/routes/NotFound';
import Page             from '~/routes/Page';
import defaultState from '../defaultState';
import configureStore   from '~/stores';
import Helmet from 'preact-helmet';
import _const                   from '~/const';


const { APP_TITLE, APP_DESCRIPTION, APP_HTML_LANG } = _const;

const store = configureStore(
  typeof window === 'object' && window.__STATE__
  || defaultState
);

const CRISP_SCRIPT = `window.$crisp=[];window.CRISP_WEBSITE_ID="25c594c7-3fd4-4b61-b3d5-7416747ff5ac";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`;
const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-WCRQV25');`;
const PIXEL_SCRIPT = `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '410162552777679');
      fbq('track', 'PageView');`;

export default class App extends Component {
  // Store route parameters in the state when route changes
  constructor(props) {
    super(props);
    // We used to set the initial lang based on navigator.language, but we no
    // longer use that as root url shoud never be reached by visitors:
    // they are redirected by Cloudflare based on their user-agent
    // Only developers can reach root, and they'll see english version.
    this.state = { lang: 'en-US' };
  }

  @autobind
  handleRoute(e) {
    const {
      lang = this.state.lang,
      minPack,
      returnUrl,
      rentingPrice,
      city,
      page,
      admin = false,
      rentingId,
      roomId,
      date,
    } = e.current.attributes;

    // route params are only relevant when they're defined, so we'll filter-out
    // all undefined values.
    (this.props.store || store).dispatch(updateRoute(Object.assign(
      Utils.filterOutUndef({
        lang,
        minPack,
        returnUrl,
        rentingPrice,
        city,
        page: +page,
        admin,
        rentingId,
        roomId,
      }),
      { date } // needs to be reset when absent
    )));

    this.setState({ lang });

    if (typeof window === 'object') {
      // Make sure GTM is aware of pageviews
      window.dataLayer && window.dataLayer.push({
        event: 'Pageview',
        url: window.location.toString(),
      });

      // Use setTimeout to make sure this runs after React Router's own listener
      setTimeout(() => {
        // Keep default behavior of restoring scroll position when user:
        // - clicked back button
        // - clicked on a link that programmatically calls `history.goBack()`
        // - manually changed the URL in the address bar (here we might want
        // to scroll to top, but we can't differentiate it from the others)
        if (location.action === 'POP') {
          return;
        }
        // In all other cases, scroll to top
        window && window.scrollTo(0, 0);
      });
    }
  }

  render() {
    return (
      <Provider store={this.props.store || store}>
        <div id="app">
          <Helmet
            htmlAttributes={{ lang: APP_HTML_LANG[this.state.lang] }}
            defaultTitle={APP_TITLE[this.state.lang]}
            titleTemplate={APP_TITLE[this.state.lang] + ' - %s'}
            meta={[
              {
                name: 'description',
                content: APP_DESCRIPTION[this.state.lang],
              },
              { name: 'viewport', content: 'width=device-width,initial-scale=1' },
              { name: 'mobile-web-app-capable', content: 'yes' },
              { name: 'apple-mobile-web-app-capable', content: 'yes' },
              { name: 'theme-color', content: '#1C2B4A' },
              { charset: 'utf-8' },
            ]}
            link={[
              { rel: 'manifest', href: '/manifest.json' },
              {
                rel: 'stylesheet',
                href: '//fonts.googleapis.com/css?family=Open+Sans|Open+Sans+Condensed:700|Material+Icons',
                media: 'none',
                onload: "if(media!='all')media='all'",
              },
            ]}
            script={[
              { type: 'javascript', innerHTML: CRISP_SCRIPT },
              { type: 'javascript', innerHTML: GTM_SCRIPT },
              { type: 'javascript', innerHTML: PIXEL_SCRIPT },
            ]}
            noscript={[
              { innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WCRQV25" height="0" width="0" style="display:none;visibility:hidden"></iframe>` },
              { innerHTML: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=410162552777679&ev=PageView&noscript=1" />` },
            ]}
          />
          <Match path="/">
            { // No header on invoices
              ({ matches, path, url }) =>
                rInvoice.test(path) ?
                  '' : <Header {...{ path }} />
            }
          </Match>
          <Router onChange={this.handleRoute} url={this.props.url || undefined}>
            <Home path="/" />
            <Home path="/en-US" />
            <Home path="/fr-FR" />
            <Search path="/:lang/search/:city/:page?" />
            <BookingForm path="/:lang/booking/:roomId" />
            <BookingSummary path="/:lang/summary/:rentingId" />
            <BookingConfirmed path="/:lang/welcome/:rentingId" />
            <Invoice path="/:lang/invoice/:orderId" />
            <Payment path="/:lang/payment/:orderId" />
            <Room path="/:lang/room/:roomId" />
            <Services path="/:lang/services" />
            <Process path="/:lang/booking-process" />
            <Page path="/:lang/page/:slug" />
            <About path="/:lang/about" />
            <Contact path="/:lang/contact" />
            <NotFound path="/:lang/:path" />
            <NotFound default />
          </Router>
          <Match path="/">
            { // No footer on invoice, home
              ({ matches, path, url }) =>
                [rInvoice, rSearch].some((regex) => regex.test(path)) ?
                  '' : <Footer />
            }
          </Match>
        </div>
      </Provider>
    );
  }
}

App.Helmet = Helmet;
App.configureStore = configureStore;
App.defaultState = defaultState;

App.prefetchRoutes = (url, dispatch) => {
  const roomMatch = url.match(/(.+)\/room\/(.+)/)
  if (roomMatch !== null) {
    return Room.prefetch(roomMatch[1], roomMatch[2], dispatch);
  }
  const searchMatch = url.match(/(.+)\/search\/(.+)/)
  if (searchMatch !== null) {
    return Search.prefetch(searchMatch[2], dispatch);
  }
  const pageMatch = url.match(/(.+)\/page\/(.+)/);
  if (pageMatch !== null) {
    return Page.prefetch(pageMatch[1], pageMatch[2], dispatch);
  }
  return Promise.resolve();
};

const rSearch = /^\/[\w-]{5}\/search/;
const rInvoice = /^\/[\w-]{5}\/invoice/;
