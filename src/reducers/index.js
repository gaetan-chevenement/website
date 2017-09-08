import { combineReducers } from 'redux';
import { createReducer }   from 'redux-act';
import R                   from 'ramda';

import {
  updateRoute,
  updateBooking,
  setBookingErrors,
  deleteBookingError,
  validateBooking,
  updateCard,
  setCardErrors,
  deleteCardError,
  validateCard,
  getApartment,
  getRoom,
  getOrder,
  listOrders,
  getRenting,
}                           from '~/actions';

const routeReducer = createReducer({
  [updateRoute]: (state, payload) => ({ ...payload }),
}, {});

const bookingReducer = createReducer({
  ...createFormReducer({
    update: updateBooking,
    setErrors: setBookingErrors,
    deleteError: deleteBookingError,
    validate: validateBooking,
  }),
  [getRoom.ok]: (state, { bookingDate }) => ({
    ...state,
    bookingDate,
  }),
}, { errors: {} });

const cardReducer = createReducer({
  ...createFormReducer({
    update: updateCard,
    setErrors: setCardErrors,
    deleteError: deleteCardError,
    validate: validateCard,
  }),
}, { errors: {} });

const roomsReducer = createReducer({
  ...createGetReducer(getRoom),
  [getRoom.ok]: (state, { room }) => ({
    ...state,
    [room.id]: room,
  }),
}, {});

const apartmentsReducer = createReducer({
  ...createGetReducer(getApartment),
  [getRoom.ok]: (state, { apartment }) => ({
    ...state,
    [apartment.id]: apartment,
  }),
}, {});

const rentingsReducer = createReducer({
  ...createGetReducer(getRenting),
}, {});

const ordersReducer = createReducer({
  ...createGetReducer(getOrder),

  [listOrders]: (state, payload) => ({
    ...state,
    ...payload.reduce((orders, order) => {
      orders[order.id] = order;
      return orders;
    }, {}),
  }),
}, {});

const reducers = {
  route: routeReducer,
  booking: bookingReducer,
  card: cardReducer,
  rooms: roomsReducer,
  apartments: apartmentsReducer,
  rentings: rentingsReducer,
  orders: ordersReducer,
};
const combinedReducers = combineReducers(reducers);

export default function(state = {}, action) {
  return combinedReducers(state, action);
}

export function createGetReducer(actionAsync) {
  return {
    [actionAsync.request]: (state, { request }) => ({
      ...state,
      [request]: { isLoading: true },
    }),
    [actionAsync.ok]: (state, { response }) => ({
      ...state,
      [response.id]: response,
    }),
    [actionAsync.error]: (state, { request, error }) => ({
      ...state,
      [request]: {
        ...state[request],
        error,
      },
    }),
  };
}

export function createFormReducer({ update, setErrors, deleteError, validate }) {
  return {
    [update]: (state, payload) => ({ ...state, ...payload }),
    [setErrors]: (state, payload) => ({
      ...state,
      errors: payload,
    }),
    [deleteError]: (state, payload) => ({
      ...state,
      errors: R.dissoc(payload, state.errors),
    }),
    [validate.request]: (state) => ({
      ...state,
      isValidating: true,
    }),
    [validate.ok]: (state, { response }) => ({
      ...state,
      ...response.data,
      isValidating: false,
      errors: {},
    }),
    [validate.error]: (state, { request, error }) => ({
      ...state,
      isValidating: false,
      errors: error,
    }),
  };
}
