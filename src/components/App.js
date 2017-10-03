import { h, Component } from 'preact';
import { Router }       from 'preact-router';
import { Provider }     from 'react-redux';
import { batch }        from 'redux-act';
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
import Utils            from '~/utils';
import Header           from './Header';
// import Home from 'async!./home';
// import Profile from 'async!./profile';

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
  orders: {},
  rooms: {},
  apartments: {},
  pictures: {},
});

export default class App extends Component {

  // Store route parameters in the state when route changes
  handleRoute = (e) => {
    const {
      lang = /^fr-/.test(window.navigator.language) ? 'fr-FR' : 'en-EN',
      minPack,
      roomId,
      rentingId,
      clientId,
      orderId,
    } = e.current.attributes;

    // route params are only relevant when they're defined, so we'll filter-out
    // all undefined values.
    batch(
      store.dispatch(updateRoute(Utils.filterOutUndef(
        { lang, rentingId, clientId, minPack }
      ))),
      roomId !== undefined && store.dispatch(updateBooking({ roomId })),
      orderId !== undefined && store.dispatch(updatePayment({ orderId }))
    );

  };

  render() {
    return (
      <Provider store={store}>
        <div id="app">
          <Header />
          <Router onChange={this.handleRoute}>
            <Home path="/:lang" default />
            <Search path="/:lang/search/:city" />
            <BookingStep1 path="/:lang/booking/:roomId/" />
            <BookingStep1 path="/:lang/booking/:roomId/1" />
            <BookingStep2 path="/:lang/booking/:roomId/2" />
            <BookingStep3 path="/:lang/booking/:roomId/3" />
            <Renting path="/:lang/renting/:rentingId" />
            <Payment path="/:lang/payment/:orderId" />
          </Router>
          <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans|Material+Icons" />
          <link rel="stylesheet" href="//weloveiconfonts.com/api/?family=brandico" />
        </div>
      </Provider>
    );
  }
}
