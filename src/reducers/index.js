import { combineReducers }  from 'redux';
import { createReducer }    from 'redux-act';
import memoize              from 'memoize-immutable';
import NamedTupleMap        from 'namedtuplemap';
import pickBy               from 'lodash/pickBy';
import forEach              from 'lodash/forEach';

import {
  updateRoute,
  updateSearch,
  updateBooking,
  setBookingErrors,
  deleteBookingError,
  validateBooking,
  updateSummary,
  setSummaryErrors,
  deleteSummaryError,
  validateSummary,
  saveBooking,
  updatePayment,
  setPaymentErrors,
  deletePaymentError,
  validatePayment,
  savePayment,
  resetPayment,
  getRoom,
  getPage,
  getDistrict,
  listRooms,
  getOrder,
  listOrders,
  getRenting,
  getI18n,
  hideInfoSnackbar,
  showInfoSnackbar,
}                           from '~/actions';

const _ = { pickBy, forEach };
const noErrors = {};

const routeReducer = createReducer({
  [updateRoute]: (state, payload) => ({
    ...state,
    ...payload,
  }),
}, {});
const sessionReducer = createReducer({
  [hideInfoSnackbar]: (state, payload) => ({
    ...state,
    isInfoSnackbarActive: false,
  }),
  [showInfoSnackbar]: (state, payload) => ({
    ...state,
    isInfoSnackbarActive: true,
  }),
}, {});
const searchReducer = createReducer({
  [updateSearch]: (state, payload) => ({
    ...state,
    ...payload,
  }),
  [listRooms.ok]: (state, { count }) => ({
    ...state,
    count,
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

const summaryReducer = createReducer({
  ...createFormReducer({
    update: updateSummary,
    setErrors: setSummaryErrors,
    deleteError: deleteSummaryError,
    validate: validateSummary,
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
  [resetPayment]: (state) => ({
    ...state,
    errors: noErrors,
    cardNumber: '',
    holderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  }),
  [getOrder.ok]: (state, payload) => (payload.id !== state.orderId ?
    state :
    { ...state, balance: payload.balance }
  ),
}, { errors: noErrors });

const roomsReducer = createReducer({
  ...createGetReducer(getRoom),
  // getRoom returns { rooms, apartments } so it needs a special reducer
  [getRoom.ok]: (state, { rooms }) => ({
    ...state,
    ...rooms,
  }),
  [getRenting.ok]: (state, { _Room: room }) => ({
    ...state,
    [room.id]: room,
  }),
  ...createListReducer(listRooms, 'room'),
}, {});

const pagesReducer = createReducer({
  ...createGetReducer(getPage),
  // getRoom returns { rooms, apartments } so it needs a special reducer
  [getPage.ok]: (state, data) => ({
    ...state,
    [data.slug]: data,
  }),
}, {});

const apartmentsReducer = createReducer({
  [getRoom.ok]: (state, { apartments }) => ({
    ...state,
    ...apartments,
  }),
  [listRooms.ok]: (state, { apartments }) => ({
    ...state,
    ...apartments,
  }),
}, {});

const districtsReducer = createReducer({
  ...createGetReducer(getDistrict),
}, {});

const rentingsReducer = createReducer({
  ...createGetReducer(getRenting),
}, {});

const ordersReducer = createReducer({
  ...createGetReducer(getOrder),
  ...createListReducer(listOrders, 'order'),
}, {});

const i18nsReducer = createReducer({
  [getI18n.ok]: (state, { key, value }) => ({
    ...state,
    [key]: value,
  }),
}, {});

const clientReducer = createReducer({
  [getRenting.ok]: (state, { _Client: client }) => client,
}, {});

const reducers = {

  /* generally modified by the router */
  route: avoidUselessMutations(routeReducer),
  session: avoidUselessMutations(sessionReducer),

  /* generally modified by user-interactions */
  search: avoidUselessMutations(searchReducer),
  booking: avoidUselessMutations(bookingReducer),
  summary: avoidUselessMutations(summaryReducer),
  payment: avoidUselessMutations(paymentReducer),

  /* generally modified by interacting with our REST API */
  rooms: roomsReducer,
  apartments: apartmentsReducer,
  districts: districtsReducer,
  rentings: rentingsReducer,
  orders: ordersReducer,
  client: clientReducer,
  pages: pagesReducer,
  i18ns: i18nsReducer,
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
      // exclude related records from attributes
      [payload.id]: _.pickBy(payload, (value, key) => !/^_/.test(key)),
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
      isLoading: true,
      error: false,
    }),
    [actionAsync.ok]: (state, payload) => ({
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

export function listOkReducer(modelName) {
  return (state, payload) => {
    const muted = {};

    _.forEach(payload, (value, key) => {
      if ( key in state ) {
        muted[key] = {
          ...state[key],
          [modelName]: value,
        };
      }
    });

    return Object.keys(muted).length > 0 ? { ...state, ...muted } : state;
  };
}

// delete a property from an object (equivalent to Ramda.dissoc)
function dissoc(propName, object) {
  const clone = { ...object };

  delete clone[propName];

  return clone;
}
