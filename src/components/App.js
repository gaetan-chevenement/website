import { h, Component } from 'preact';
import { Router }       from 'preact-router';
import Match            from 'preact-router/match';
import { Provider }     from 'react-redux';
import autobind         from 'autobind-decorator';
// import { ThemeProvider } from 'react-css-themr';

import configureStore   from '~/stores';
import Services         from 'async!../routes/Services';
import Process          from 'async!../routes/Process';
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
      city,
      admin = false,
      rentingId,
      roomId,
    } = e.current.attributes;

    // route params are only relevant when they're defined, so we'll filter-out
    // all undefined values.
    store.dispatch(updateRoute(Utils.filterOutUndef({
      lang, minPack, city, returnUrl, admin, rentingId, roomId,
    })));

    this.setState({ lang });

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
      window.scrollTo(0, 0);
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      lang: /^fr-/.test(window.navigator.language) ? 'fr-FR' : 'en-US',
    };
  }

  render() {
    return (
      <Provider store={store}>
        <div id="app">
          <Match path="/">
            { // No header on invoices
              ({ matches, path, url }) =>
                rInvoice.test(path) ?
                  '' : <Header lang={this.state.lang} />
            }
          </Match>
          <Router onChange={this.handleRoute}>
            <Home path="/:lang" default />
            <Search path="/:lang/search/:city" />
            <BookingForm path="/:lang/booking/:roomId" />
            <BookingSummary path="/:lang/summary/:rentingId" />
            <BookingConfirmed path="/:lang/welcome/:rentingId" />
            <Invoice path="/:lang/invoice/:orderId" />
            <Payment path="/:lang/payment/:orderId" />
            <Services path="/:lang/services" />
            <Process path="/:lang/booking-process" />
            <Room path="/:lang/room/:roomId" />
          </Router>
          <Match path="/">
            { // No footer on invoice, home
              ({ matches, path, url }) =>
                [rInvoice, rSearch].some((regex) => regex.test(path)) ?
                  '' : <Footer lang={this.state.lang} />
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
