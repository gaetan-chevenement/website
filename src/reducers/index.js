import { combineReducers } from 'redux';
import { createReducer }   from 'redux-act';
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
  getApartment,
  getRoom,
  listRooms,
  getOrder,
  listOrders,
  getRenting,
  listPictures,
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
}, { errors: noErrors });

const roomsReducer = createReducer({
  ...createGetReducer(getRoom),
  // getRoom returns { rooms, apartments } so it needs a special reducer
  [getRoom.ok]: (state, { rooms }) => ({
    ...state,
    ...rooms,
  }),
  ...createListReducer(listRooms, 'room'),
  [getRenting.ok]: (state, { _room: room }) => ({
    ...state,
    [room.id]: room,
  }),
}, {});

const apartmentsReducer = createReducer({
  ...createGetReducer(getApartment),
  [getRoom.ok]: (state, { apartments }) => ({
    ...state,
    ...apartments,
  }),
  [listRooms.ok]: (state, { apartments }) => ({
    ...state,
    ...apartments,
  }),
}, {});

const rentingsReducer = createReducer({
  ...createGetReducer(getRenting),
}, {});

const ordersReducer = createReducer({
  ...createGetReducer(getOrder),
  ...createListReducer(listOrders, 'order'),
}, {});

const picturesReducer = createReducer({
  ...createListReducer(listPictures, 'picture'),
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
  pictures: picturesReducer,
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

export function createListReducer(actionAsync, modelName) {
  return {
    [actionAsync.request]: (state) => ({
      ...state,
      isLoading: true,
      error: false,
    }),
    [actionAsync.ok]: (state, payload) => ({
      ...state,
      isLoading: false,
      error: false,
      ...payload[`${modelName}s`],
    }),
    [actionAsync.error]: (state, payload) => ({
      ...state,
      isLoading: false,
      error: payload,
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
      errors: dissoc(payload, state.errors),
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

// delete a property from an object (equivalent to Ramda.dissoc)
function dissoc(propName, object) {
  const clone = { ...object };

  delete clone[propName];

  return clone;
}
