import { createReducer }    from 'redux-act';
import { receiveApartment } from '~/actions';

export default createReducer({
  [receiveApartment]: (state, payload) => ({
    ...state,
    [payload.id]: payload.attributes,
  }),
}, {});
