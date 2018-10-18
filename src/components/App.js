import { h, Component } from 'preact';
import { Router }       from 'preact-router';
import Match            from 'preact-router/match';
import { Provider }     from 'react-redux';
import autobind         from 'autobind-decorator';
import Helmet           from 'preact-helmet';
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

import { updateRoute }  from '~/actions';
import Utils            from '~/utils';
import NotFound         from '~/routes/NotFound';
import Page             from '~/routes/Page';
import defaultState     from '~/defaultState';
import configureStore   from '~/stores';
import _const           from '~/const';
import Header           from './Header';
import Footer           from './Footer';

const {
  CRISP_SCRIPT,
  GTM_SCRIPT,
  PIXEL_SCRIPT,
} = _const;
const store = configureStore(
  typeof window === 'object' && window.__STATE__
  || defaultState
);
const rLang = /^\/[a-z]{2}[A-Z]{2}\//;

export default class App extends Component {
  @autobind
  handleRoute(e = { current: {} }) {
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

  // Store route parameters in the state when route changes
  constructor(props) {
    super(props);
    // We used to set the initial lang based on navigator.language, but we no
    // longer use that as root url shoud never be reached by visitors:
    // they are redirected by Cloudflare based on their user-agent
    // Only developers can reach root, and they'll see english version.
    this.state = { lang: 'en-US' };
  }

  render() {
    const { lang } = this.state;

    return (
      <Provider store={this.props.store || store}>
        <div id="app">
          <Match path="/">
            {({ path }) => (
              <Helmet
                htmlAttributes={{ lang: lang.split('-')[0] }}
                defaultTitle={definition[lang].appTitle}
                titleTemplate={`${definition[lang].appTitle} - %s`}
                meta={[
                  { name: 'description', content: definition[lang].appDescription },
                  { name: 'viewport', content: 'width=device-width,initial-scale=1' },
                  { name: 'mobile-web-app-capable', content: 'yes' },
                  { name: 'apple-mobile-web-app-capable', content: 'yes' },
                  { name: 'theme-color', content: '#1C2B4A' },
                  { charset: 'utf-8' },
                  { name: 'language', content: lang },

                ]}
                link={[
                  { rel: 'manifest', href: '/manifest.json' },
                  { rel: 'canonical', href: path },
                  { rel: 'alternate', href: path.replace(rLang, '/en-US/'), hrefLang: 'en' },
                  { rel: 'alternate', href: path.replace(rLang, '/fr-FR/'), hrefLang: 'fr' },
                  { rel: 'alternate', href: path.replace(rLang, '/es-ES/'), hrefLang: 'es' },
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
            )}
          </Match>
          <Match path="/">
            { // No header on invoices
              ({ matches, path, url }) =>
                [rInvoice].some((regex) => regex.test(path)) ?
                  '' : <Header {...{ path }} />
            }
          </Match>
          <Router onChange={this.handleRoute} url={this.props.url || undefined}>
            <Home path="/" />
            <Home path="/:lang" />
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
            { // No footer on invoice or search
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

const definition = {
  'en-US': {
    appTitle: 'Chez Nestor, Your ready-to-live-in flatshares',
    appDescription: `
      Chez Nestor is the leader in furnished shared accommodation in France.
      Present in many cities, we offer you brand new, equipped and furnished
      apartments in the heart of the city centre! Discover and book your room
      on our website!
    `,
  },
  'fr-FR': {
    appTitle: `
      Chez Nestor, spécialiste de la colocation meublée et équipée en
      centre-ville
    `,
    appDescription: `
      Chez Nestor est le leader de la colocation meublée en France. Présent
      dans de nombreuses villes, nous vous proposons des appartements refaits
      à neufs, équipés et meublés en plein centre-ville ! Découvrez et réservez
      votre chambre sur notre site !
    `,
  },
  'es-ES': {
    appTitle: 'Chez Nestor, el líder de la vivienda compartida amueblada.',
    appDescription: `
      Chez Nestor es el líder de la vivienda compartida amueblada en
      Francia. Estamos presentes en numerosas ciudades, le ofrecemos apartamentos completamente renovados,
      equipados y amueblados en el corazón de la ciudad! Descubre y
      reserva tu habitación desde nuestra página web!
    `,
  },
};

App.Helmet = Helmet;
App.configureStore = configureStore;
App.defaultState = defaultState;

App.prefetchRoutes = (url, dispatch) => {
  const roomMatch = url.match(/(.+)\/room\/(.+)/);

  if ( roomMatch !== null ) {
    return Room.prefetch(roomMatch[1], roomMatch[2], dispatch);
  }

  const searchMatch = url.match(/(.+)\/search\/(.+)/);

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
