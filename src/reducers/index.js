import { combineReducers } from 'redux';

import route               from './route';
import booking             from './booking';
import rooms               from './rooms';
import apartments          from './apartments';

const reducers = {
  route,
  booking,
  rooms,
  apartments,
};
const combinedReducers = combineReducers(reducers);

export default function(state = {}, action) {
  return combinedReducers(state, action);
}
