import { createReducer }  from 'redux-act';
import {
  fetchRoom,
  receiveRoom,
}                         from '~/actions';

export default createReducer({
  [fetchRoom]: (state, payload) => ({
    ...state,
    [payload.id]: { isLoading: true },
  }),
  [receiveRoom]: (state, payload) => ({
    ...state,
    [payload.id]: {
      ...payload.attributes,
      ApartmentId: payload.relationships.Apartment.data.id,
    },
  }),
}, {});
