import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { Provider } from 'react-redux';
import 'material-design-icons/iconfont/material-icons';
// import { ThemeProvider } from 'react-css-themr';


import configureStore from '../stores';
import Home from '../routes/Home';
import Search from '../routes/Search';
import BookingStep1 from '../routes/BookingStep1';
import BookingStep2 from '../routes/BookingStep2';
import BookingStep3 from '../routes/BookingStep3';
import Header from './Header';
// import Home from 'async!./home';
// import Profile from 'async!./profile';

const now = new Date();
const store = configureStore({
  booking: {
    rentAmount: 66800,
    bookingDate: now,
    city: 'lyon',
    pack: 'comfort',
    roomCount: 3,
    checkinDate: undefined,
    checkinTime: undefined,
    name: '',
  },
});

export default class App extends Component {

  /** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
  handleRoute = (e) => {
    this.currentUrl = e.url;
  };

  render() {
    return (
      <Provider store={store}>
        <div id="app">
          <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto" />
          <Header />
          <Router onChange={this.handleRoute}>
            <Home path="/:lang/" />
            <Search path="/:lang/search/:city" />
            <BookingStep1 path="/:lang/booking/:room/" />
            <BookingStep1 path="/:lang/booking/:room/1" />
            <BookingStep2 path="/:lang/booking/:room/2" />
            <BookingStep3 path="/:lang/booking/:room/3" />
          </Router>
        </div>
      </Provider>
    );
  }
}
