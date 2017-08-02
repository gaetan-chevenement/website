import { combineReducers } from 'redux';

import booking from './booking';

const reducers = {
  booking,
};
const combinedReducers = combineReducers(reducers);

export default function(state = {}, action) {
  return combinedReducers(state, action);
}
