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
import { updateRoute }  from '~/actions';
import Header           from './Header';
// import Home from 'async!./home';
// import Profile from 'async!./profile';

const now = new Date();
const store = configureStore({
  route: {},
  booking: {
    bookingDate: now,
    pack: 'comfort',
    // firstName: {},
    // lastName: {},
    // email: {},
    // checkinDate: {},
  },
  rooms: {},
  apartments: {},
});

export default class App extends Component {

  // Store route parameters in the state when route changes
  handleRoute = (e) => {
    store.dispatch(updateRoute(e.current.attributes));
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
          </Router>
        </div>
      </Provider>
    );
  }
}
