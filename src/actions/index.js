import { createAction }         from 'redux-act';
import { createActionAsync }    from 'redux-act-async';
import queryString              from 'query-string';
import mapValues                from 'lodash/mapValues';
import flattenDeep              from 'lodash/flattenDeep';
import values                   from 'lodash/values';
import filter                   from 'lodash/filter';
import Utils                    from '~/utils';
import Features                 from '~/components/Features/features';
import {
  ROOM_SEGMENTS,
}                               from '~/const';

const _ = { mapValues, values, filter, flattenDeep };

export const updateRoute = createAction('Update route object');
export const updateSearch = createAction('Update search state');
export const addRoomFeature = createAction('add feature to room');
export const deleteRoomFeature = createAction('delete feature from room');
export const addApartmentFeature = createAction('add feature to apartment');
export const deleteApartmentFeature = createAction('delete feature from apartment');
export const updateApartment = createAction('Update Apartment Object');
export const updateRoom = createAction('Update Room Object');
export const {
  updateBooking,
  setBookingErrors,
  deleteBookingError,
  validateBooking,
} = createFormAction('Booking', Utils.bookingSchema);
export const {
  updatePayment,
  setPaymentErrors,
  deletePaymentError,
  validatePayment,
} = createFormAction('Payment', Utils.paymentSchema);

export const getRoom =
  createActionAsync(
    'get Room by id',
    (id) => Utils.fetchJson(`/Room?filterType=and&filter[id]=${id}&segment=Availability`)
      .then(throwIfNotFound('Room', id)),
    {
      noRethrow: true,
      ok: { payloadReducer: reduceRooms },
    }
  );
export const getRenting = createGetActionAsync('Renting');
export const getApartment = createGetActionAsync('Apartment');
export const getOrder =
  createActionAsync(
    'get Order and associated OrderItems by Order id',
    (id) => Utils.fetchJson(`/OrderItem?filterType=and&filter[OrderId]=${id}`)
      .then(throwIfNotFound('Order', id)),
    {
      noRethrow: true,
      ok: { payloadReducer: ({ request, response: { meta, data, included } }) => ({
        ...( included.find((inc) => inc.type === 'order').attributes ),
        OrderItems: mapOrderItems(data, request[0]),
      }) },
    }
  );
export const listOrders =
  createActionAsync(
    'list Orders and associated OrderItems',
    ({ rentingId }) => {
      if ( rentingId === undefined ) {
        return Promise.reject('Can only fetch by rentingId for now');
      }

      return Utils.fetchJson(`/OrderItem?filterType=and&filter[RentingId]=${rentingId}`);
    },
    { ok: { payloadReducer: ({ response: { data, included } }) => ({
      orders: included
        .filter((inc) => inc.type === 'order')
        .map((order) => ({
          ...order.attributes,
          OrderItems: mapOrderItems(data, order.id),
        }))
        .reduce(arrayToMap, {}),
    }) } }
  );

export const listRooms =
  createActionAsync(
    'List Rooms',
    ({ city }) => {
      if ( city === undefined ) {
        return Promise.reject('Can only list Rooms by city for now');
      }

      const params = {
        segment: ROOM_SEGMENTS[city.toLowerCase()],
        'page[number]': 1,
        'page[size]': 10,
      };
      const qs = queryString.stringify(params, { encode: false });

      return Utils.fetchJson(`/Room?${qs}`);
    },
    { ok: { payloadReducer: reduceRooms } }
  );

export const listPictures =
  createActionAsync('List pictures', ({ room }) => (
    Utils.fetchJson(`/Pictures`)
      .then(result => Object.assign(result, { roomId: room.id }))
  ));
export const listFeatures =
  createActionAsync(
    'list Features of a room and apartment',
    (roomId, apartmentId) => {
      if (roomId === undefined || apartmentId === undefined ) {
        return Promise.reject('Can only fetch by roomId or by ApartmentIdfor now');
      }

      const params = {
        'page[number]': 1,
        'page[size]': 100,
      };
      const qs = queryString.stringify(params, { encode: false });

      return Utils.fetchJson(`/Term?filterType=or&filter[TermableId]=${roomId},${apartmentId}&${qs}`);
    },
    { ok: { payloadReducer: ({ request: [ roomId, apartmentId ], response: { data, included } }) => {
      // TODO: refactor
      const features = [{
        id: roomId,
        Features: data
          .filter((_data) => _data.attributes.termable === 'Room' && /^room-features-/.test(_data.attributes.taxonomy))
          .map(({ attributes }) => attributes ),
      }, {
        id: apartmentId,
        Features: data
          .filter((_data) => _data.attributes.termable === 'Apartment' && /^apartment-features-/.test(_data.attributes.taxonomy))
          .map(({ attributes }) =>  attributes  ),
      }];
      // TODO: refactor (and simplify if possible)
      if ( !features[0].Features.length ) {
        features[0].Features = _.flattenDeep(
          _.values(_.mapValues(
            Features.Room,
            (value, taxonomy, object) =>
              _.filter(
                object[taxonomy],
                (term, name) => {
                  Object.assign(term, { name, taxonomy, termable: 'Room' });
                  return term.value === true;
                }))));
      }
      if ( !features[1].Features.length ) {
        features[1].Features = _.flattenDeep(
          _.values(_.mapValues(
            Features.Apartment,
            (value, taxonomy, object) => _.filter(
              object[taxonomy],
              (term, name) => {
                Object.assign(term, { name, taxonomy, termable: 'Apartment' });
                return term.value === true;
              }))));
      }
      return features;
    } } }
  );

export const saveFeatures =
  createActionAsync(
    'save Terms of Room and Apartment in the backoffice',
    ({ roomId, apartmentId, ApartmentFeatures, RoomFeatures }) => (
      Utils.fetchJson(
        '/actions/public/updateTerms',
        {
          method: 'post',
          body: {
            roomId,
            apartmentId,
            RoomFeatures,
            ApartmentFeatures,
          },
        },
      )
    ),
    {
      noRethrow: true,
      error: { payloadReducer: (payload) => ({
        unauthorized: 'You must be log to the backoffice to update room\'s features',
      }) },
    },
  );

export const saveRoomAndApartment =
  createActionAsync(
    'save Room and Apartment in the backoffice',
    ({ room, apartment }) => (
      Utils.fetchJson(
        '/actions/public/update-apartment-and-room',
        {
          method: 'post',
          body: {
            room,
            apartment,
          },
        },
      )
    ),
    { error: { payloadReducer: (payload) => ({ errors: { unexpected: payload.error.message } }) } },
  );

export const saveBooking =
  createActionAsync(
    'save Renting and associated Client in the backoffice',
    ({ room, booking }) => (
      Utils.fetchJson(
        '/actions/public/create-client-and-renting',
        {
          method: 'post',
          body: {
            roomId: room.id,
            pack: booking.pack,
            client: booking,
            checkinDate: booking.checkinDate,
            currentPrice: room['current price'],
            bookingDate: Utils.getBookingDate(room),
          },
        },
      )
    ),
    { error: { payloadReducer: (payload) => {
      if ( /unavailable/.test(payload.error) ) {
        return { errors: { isUnavailable: true } };
      }

      if ( /price/.test(payload.error) ) {
        return { errors: { hasPriceChanged: true } };
      }

      return { errors: { unexpected: payload.error.message } };
    } } },
  );

export const savePayment =
  createActionAsync(
    'save Payment and associated Order in the backoffice',
    (payment, orderId) => {
      const {
        cardNumber,
        cvv,
        expiryMonth,
        expiryYear,
        holderName,
      } = payment;

      return Utils.fetchJson('/actions/public/create-payment', {
        method: 'post',
        body: {
          cardNumber,
          cvv,
          expiryMonth,
          expiryYear,
          holderName,
          orderId,
        },
      });
    },
    { error: { payloadReducer: (payload) => {
      if ( /fully paid/i.test(payload.error) ) {
        return { errors: { payment: { hasWrongBalance: true } } };
      }
      if ( /not found/i.test(payload.error) ) {
        return { errors: { payment: { hasNoOrder: true  } } };
      }
      if ( /invalid card type/i.test(payload.error) ) {
        return { errors: { cardNumber: 'Invalid card type (only Visa and Mastercard are allowed)' } };
      }
      if ( /Invalid card/.test(payload.error) ) {
        return { errors: { cardNumber: 'Invalid card number' } };
      }
      if ( /CVV2/i.test(payload.error) ) {
        return { errors: { cvv: 'Invalid cvv' } };
      }
      if ( /no longer available/i.test(payload.error) ) {
        return { errors: { payment: { isBooked: 'This room has been booked by someone else.' } } };
      }
      return { errors: { payment: { unexpected: payload.error.message } } };
    } } },
  );

function throwIfNotFound(modelName, id) {
  return (response) => {
    if ( response.meta.count === 0 ) {
      throw new Error(`${modelName} ${id} not found`);
    }

    return response;
  };
}

function createGetActionAsync(modelName) {
  return createActionAsync(
    `get ${modelName} by id`,
    (id) => Utils.fetchJson(`/${modelName}/${id}`)
      // No record returned is an error
      .tap((response) => {
        if ( response.meta.count === 0 ) {
          throw new Error(`${modelName} ${id} not found`);
        }
      }),
    { ok: { payloadReducer: ({ response }) => ({
      ...response.data.attributes,
      ...response.included.reduce((attributes, value) => {
        attributes[`${value.type}Id`] = value.id;
        attributes[`_${value.type}`] = value.attributes;

        return attributes;
      }, {}),
    }) } }
  );
}

function createFormAction(formName, schema) {
  return {
    [`update${formName}`]: createAction(`Update ${formName} details`),
    [`set${formName}Errors`]: createAction(`Set ${formName} errors`),
    [`delete${formName}Error`]: createAction(`Delete a specific ${formName} error`),
    [`validate${formName}`]: createActionAsync(
      `Validate ${formName}`,
      (content) => schema.validate(content, { abortEarly: false }),
      { error: { payloadReducer: ({ error }) => (
        error.inner.reduce((errors, error) => {
          errors[error.path] = error.message;
          return errors;
        }, {})
      ) } }
    ),
  };
}

function mapOrderItems(data, orderId) {
  return data
    .filter(({ relationships: { Order } }) => (
      Order.data.id === orderId
    ))
    .map(({ attributes, relationships: { Renting, Product } }) => ({
      ...attributes,
      RentingId: Renting.data && Renting.data.id,
      ProductId: Product.data && Product.data.id,
    }));
}

function reduceRooms({ response: { data = [], included = [] } }) {
  return {
    rooms: data
      .filter((item) => item.type === 'room')
      .map((item) => ({
        ...item.attributes,
        ApartmentId: item.relationships.Apartment.data.id,
        availableAt: new Date(item.attributes.availableAt),
      }))
      .reduce(arrayToMap, {}),
    apartments: included
      .filter((item) => item.type === 'apartment')
      .map((item) => ({ ...item.attributes }))
      .reduce(arrayToMap, {}),
  };
}

function arrayToMap(items, item, i) {
  items[item.id] = item;
  return items;
}
