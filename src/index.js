import App from './components/App';
import Raven from 'raven-js';
import 'babel-polyfill';
import './style/index.scss';

Raven
  .config('https://53f2fffc4a714a8896331939eff077ab@sentry.io/251362')
  .install();

export default App;
