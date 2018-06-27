import { h, Component } from 'preact';
import { Router }       from 'preact-router';
import Match            from 'preact-router/match';
import { Provider }     from 'react-redux';
import autobind         from 'autobind-decorator';
// import { ThemeProvider } from 'react-css-themr';

import configureStore   from '~/stores';
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

export default class App extends Component {
  // Store route parameters in the state when route changes
  @autobind
  handleRoute(e) {
    const {
      lang = this.state.lang,
      minPack,
      returnUrl,
      updatedAt,
      city,
      page,
      admin = false,
      rentingId,
      roomId,
      date,
    } = e.current.attributes;

    // route params are only relevant when they're defined, so we'll filter-out
    // all undefined values.
    store.dispatch(updateRoute(Object.assign(
      Utils.filterOutUndef({
        lang,
        minPack,
        returnUrl,
        updatedAt,
        city,
        page: +page,
        admin,
        rentingId,
        roomId,
      }),
      { date } // needs to be reset when absent
    )));

    this.setState({ lang });

    if ( typeof window === 'object' ) {
      // Make sure GTM is aware of pageviews
      window.dataLayer && window.dataLayer.push({
        event: 'Pageview',
        url: window.location.url,
      });

      // Use setTimeout to make sure this runs after React Router's own listener
      setTimeout(() => {
        // Keep default behavior of restoring scroll position when user:
        // - clicked back button
        // - clicked on a link that programmatically calls `history.goBack()`
        // - manually changed the URL in the address bar (here we might want
        // to scroll to top, but we can't differentiate it from the others)
        if ( location.action === 'POP' ) {
          return;
        }
        // In all other cases, scroll to top
        window.scrollTo(0, 0);
      });
    }
  }

  constructor(props) {
    super(props);

    // We used to set the initial lang based on navigator.language, but we no
    // longer use that as root url shoud never be reached by visitors:
    // they are redirected by Cloudflare based on their user-agent
    // Only developers can reach root, and they'll see english version.
    this.state = { lang: 'en-US' };
  }

  render() {
    return (
      <Provider store={store}>
        <div id="app">
          <Match path="/">
            { // No header on invoices
              ({ matches, path, url }) =>
                rInvoice.test(path) ?
                  '' : <Header {...{ path }} />
            }
          </Match>
          <Router onChange={this.handleRoute}>
            <Home path="/:lang" default />
            <Search path="/:lang/search/:city/:page?" />
            <BookingForm path="/:lang/booking/:roomId" />
            <BookingSummary path="/:lang/summary/:rentingId" />
            <BookingConfirmed path="/:lang/welcome/:rentingId" />
            <Invoice path="/:lang/invoice/:orderId" />
            <Payment path="/:lang/payment/:orderId" />
            <Room path="/:lang/room/:roomId" />
            <Services path="/:lang/services" />
            <Process path="/:lang/booking-process" />
            <About path="/:lang/about" />
            <Contact path="/:lang/contact" />
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

const store = configureStore({
  route: {
    lang: 'en-US',
  },
  booking: {
    minPack: 'basic',
    pack: 'comfort',
    errors: {},
  },
  client: {},
  payment: {
    errors: {},
  },
  search: {
    errors: {},
  },
  orders: {},
  rooms: {},
  apartments: {},
  districts: {},
});
const rSearch = /^\/[\w-]{5}\/search/;
const rInvoice = /^\/[\w-]{5}\/invoice/;
