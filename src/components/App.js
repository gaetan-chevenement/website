import { h, Component } from 'preact';
import { Router }       from 'preact-router';
import { Provider }     from 'react-redux';
import autobind         from 'autobind-decorator';
// import { ThemeProvider } from 'react-css-themr';

import configureStore   from '~/stores';
import Home             from 'async!../routes/Home';
import Search           from 'async!../routes/Search';
import BookingStep1     from 'async!../routes/BookingStep1';
import BookingStep2     from 'async!../routes/BookingStep2';
import BookingStep3     from 'async!../routes/BookingStep3';
import Renting          from 'async!../routes/Renting';
import Payment          from 'async!../routes/Payment';
import Services         from 'async!../routes/Services';
import Booking          from 'async!../routes/Booking';
import Admin            from '~/routes/Admin';
import Room             from '~/routes/Room';
import {
  updateRoute,
}                       from '~/actions';
import Utils            from '~/utils';
import Header           from './Header';

const store = configureStore({
  route: {
    lang: 'en-US',
  },
  booking: {
    minPack: 'basic',
    pack: 'comfort',
    errors: {},
    // firstName: {},
    // lastName: {},
    // email: {},
    // checkinDate: {},
    // roomId: null,
  },
  payment: {
    errors: {},
  },
  search: {
    errors: {},
  },
  orders: {},
  rooms: {},
  apartments: {},
  pictures: {},
});

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
    } = e.current.attributes;

    // route params are only relevant when they're defined, so we'll filter-out
    // all undefined values.
    store.dispatch(updateRoute(Utils.filterOutUndef({
      lang, minPack, city, returnUrl, admin,
    })));

    this.setState({ lang });
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
          <Header lang={this.state.lang} />
          <Router onChange={this.handleRoute}>
            <Home path="/:lang" default />
            <Admin path="/admin" />
            <Search path="/:lang/search/:city" />
            <BookingStep1 path="/:lang/booking/:roomId/" />
            <BookingStep1 path="/:lang/booking/:roomId/1" />
            <BookingStep2 path="/:lang/booking/:roomId/2" />
            <BookingStep3 path="/:lang/booking/:roomId/3" />
            <Renting path="/:lang/renting/:rentingId" />
            <Payment path="/:lang/payment/:orderId" />
            <Services path="/:lang/services" />
            <Booking path="/:lang/booking" />
            <Room path="/:lang/room/:roomId/" />
          </Router>
          <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans|Open+Sans+Condensed:700|Material+Icons" />
        </div>
      </Provider>
    );
  }
}
