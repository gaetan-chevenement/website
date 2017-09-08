import { h, Component } from 'preact';
import { Router }       from 'preact-router';
import { Provider }     from 'react-redux';
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
  updateRoute,
  updateBooking,
}                       from '~/actions';
import Header           from './Header';
// import Home from 'async!./home';
// import Profile from 'async!./profile';

const store = configureStore({
  route: {},
  booking: {
    errors: {},
    pack: 'comfort',
    // bookingDate: new Date(),
    // firstName: {},
    // lastName: {},
    // email: {},
    // checkinDate: {},
  },
  card: { errors: {} },
  orders: {},
  rooms: {},
  apartments: {},
});

export default class App extends Component {

  // Store route parameters in the state when route changes
  handleRoute = (e) => {
    store.dispatch(updateRoute(e.current.attributes));
    if ( 'pack' in e.current.attributes ) {
      store.dispatch(updateBooking({ minPack: e.current.attributes.pack }));
    }
  };

  render() {
    return (
      <Provider store={store}>
        <div id="app">
          <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans|Material+Icons" />
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
        </div>
      </Provider>
    );
  }
}
