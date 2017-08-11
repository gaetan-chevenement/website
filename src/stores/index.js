import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware                  from 'redux-thunk';
import reducers                         from '~/reducers';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
)(createStore);

export default function(initialState) {
  const store = createStoreWithMiddleware(
    reducers,
    initialState,
    typeof window === 'object' && 'devToolsExtension' in window ?
      window.devToolsExtension() :
      undefined
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
