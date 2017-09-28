import { h, Component } from 'preact';
import { Router }       from 'preact-router';
import { Provider }     from 'react-redux';
import { batch }        from 'redux-act';
import reduce           from 'lodash/reduce';
// import { ThemeProvider } from 'react-css-themr';

import configureStore   from '~/stores';
import Home             from '~/routes/Home';
import Search           from '~/routes/Search';
import BookingStep1     from '~/routes/BookingStep1';
import BookingStep2     from '~/routes/BookingStep2';
import BookingStep3     from '~/routes/BookingStep3';
import Renting          from '~/routes/Renting';
import Payment          from '~/routes/Payment';
import {
  updateBooking,
  updateRoute,
  updatePayment,
}                       from '~/actions';
import Header           from './Header';
import Footer           from './Footer';
// import Home from 'async!./home';
// import Profile from 'async!./profile';

const _ = { reduce };

const store = configureStore({
  route: {
    lang: 'en-US',
  },
  booking: {
    minPack: 'basic',
    pack: 'comfort',
    errors: {},
    // bookingDate: new Date(),
    // firstName: {},
    // lastName: {},
    // email: {},
    // checkinDate: {},
    // roomId: null,
  },
  payment: {
    errors: {},
  },
  orders: {},
  rooms: {},
  apartments: {},
  pictures: {},
});

export default class App extends Component {

  // Store route parameters in the state when route changes
  handleRoute = (e) => {
    const {
      lang,
      minPack,
      roomId,
      rentingId,
      clientId,
      orderId,
    } = e.current.attributes;

    // route params are only relevant when they're defined, so we'll filter-out
    // all undefined values.
    batch(
      store.dispatch(updateRoute(filterOutUndef(
        { lang, rentingId, clientId, minPack }
      ))),
      store.dispatch(updateBooking(filterOutUndef({ roomId }))),
      store.dispatch(updatePayment(filterOutUndef({ orderId })))
    );

  };

  render() {
    return (
      <Provider store={store}>
        <div id="app">
          <Header />
          <Router onChange={this.handleRoute}>
            <Home path="/:lang/" />
            <Search path="/:lang/search/:city" />
            <BookingStep1 path="/:lang/booking/:roomId/" />
            <BookingStep1 path="/:lang/booking/:roomId/1" />
            <BookingStep2 path="/:lang/booking/:roomId/2" />
            <BookingStep3 path="/:lang/booking/:roomId/3" />
            <Renting path="/:lang/renting/:rentingId" />
            <Payment path="/:lang/payment/:orderId" />
          </Router>
          <Footer />
          <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans|Material+Icons" />
          <link rel="stylesheet" href="//weloveiconfonts.com/api/?family=brandico" />
        </div>
      </Provider>
    );
  }
}

function filterOutUndef(collection) {
  return _.reduce(collection, ( result, value, key ) => {
    if ( value !== undefined ) {
      result[key] = value;
    }

    return result;
  }, {});
}
