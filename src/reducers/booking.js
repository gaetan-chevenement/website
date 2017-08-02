import { createReducer } from 'redux-act';
import { updateBooking } from '../actions';

export default createReducer({
  [updateBooking]: (state, payload) => {
    console.log(state, payload);
    return ({ ...state, ...payload });
  },
}, {});
