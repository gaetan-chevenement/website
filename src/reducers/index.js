import { combineReducers } from 'redux';
import { createReducer }   from 'redux-act';
import R                   from 'ramda';
import memoize             from 'memoize-immutable';
import NamedTupleMap       from 'namedtuplemap';

import {
  updateRoute,
  updateBooking,
  setBookingErrors,
  deleteBookingError,
  validateBooking,
  saveBooking,
  updatePayment,
  setPaymentErrors,
  deletePaymentError,
  validatePayment,
  savePayment,
  getApartment,
  getRoom,
  getOrder,
  listOrders,
  getRenting,
}                           from '~/actions';

const noErrors = {};

const routeReducer = createReducer({
  [updateRoute]: (state, payload) => ({
    ...state,
    ...payload,
  }),
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
  [saveBooking.request]: (state) => ({
    ...state,
    isSaving: true,
  }),
  [saveBooking.ok]: (state) => ({
    ...state,
    isSaving: false,
    errors: noErrors,
  }),
  [saveBooking.error]: (state, payload) => ({
    ...state,
    isSaving: false,
    errors: payload.errors,
  }),
}, { errors: noErrors });

const paymentReducer = createReducer({
  ...createFormReducer({
    update: updatePayment,
    setErrors: setPaymentErrors,
    deleteError: deletePaymentError,
    validate: validatePayment,
  }),
  [savePayment.request]: (state) => ({
    ...state,
    isSaving: true,
  }),
  [savePayment.ok]: (state) => ({
    ...state,
    isSaving: false,
    isValidated: true,
    errors: noErrors,
  }),
  [savePayment.error]: (state, payload) => ({
    ...state,
    isSaving: false,
    errors: payload.errors,
  }),
}, { errors: noErrors });

const roomsReducer = createReducer({
  ...createGetReducer(getRoom),
  [getRoom.ok]: (state, { room }) => ({
    ...state,
    [room.id]: room,
  }),
  [getRenting.ok]: (state, { _room: room }) => ({
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

  [listOrders.ok]: (state, payload) => ({
    ...state,
    ...payload.reduce((orders, order) => {
      orders[order.id] = order;
      return orders;
    }, {}),
  }),
}, {});

const reducers = {

  // /* generally modified by the router */
  // route: (routeReducer),
  //
  // /* generally modified by user-interactions */
  // booking: (bookingReducer),
  // payment: (paymentReducer),

  /* generally modified by the router */
  route: avoidUselessMutations(routeReducer),

  /* generally modified by user-interactions */
  booking: avoidUselessMutations(bookingReducer),
  payment: avoidUselessMutations(paymentReducer),

  /* generally modified by interacting with our REST API */
  rooms: roomsReducer,
  apartments: apartmentsReducer,
  rentings: rentingsReducer,
  orders: ordersReducer,
};

const memoizedIdentity = memoize((state) => ( state ), { cache: new NamedTupleMap() });

const combinedReducers = combineReducers(reducers);

export default function(state = {}, action) {
  return combinedReducers(state, action);
}

export function avoidUselessMutations(reducer) {
  return function(state, action) {
    return memoizedIdentity(reducer(state, action));
  };
}

export function createGetReducer(actionAsync) {
  return {
    [actionAsync.request]: (state, payload) => ({
      ...state,
      [payload]: { isLoading: true },
    }),
    [actionAsync.ok]: (state, payload) => ({
      ...state,
      [payload.id]: payload,
    }),
    [actionAsync.error]: (state, { request, error }) => ({
      ...state,
      [request[0]]: {
        ...state[request[0]],
        isLoading: false,
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
      errors: noErrors,
    }),
    [validate.error]: (state, payload) =>  ({
      ...state,
      isValidating: false,
      errors: payload,
    }),
  };
}
