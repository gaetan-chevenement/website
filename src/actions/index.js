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
export const addRoomPicture = createAction('add picture to room');
export const deleteRoomPicture = createAction('delete picture from room');
export const updateRoomPicture = createAction('update picture from room');
export const addApartmentFeature = createAction('add feature to apartment');
export const deleteApartmentFeature = createAction('delete feature from apartment');
export const addApartmentPicture = createAction('add picture to apartment');
export const deleteApartmentPicture = createAction('delete picture from apartment');
export const updateApartmentPicture = createAction('update picture from apartment');

export const {
  updateRoom,
  setRoomErrors,
  deleteRoomError,
  validateRoom,
} = createFormAction('Room', Utils.roomSchema);
export const {
  updateApartment,
  setApartmentErrors,
  deleteApartmentError,
  validateApartment,
} = createFormAction('Apartment', Utils.apartmentSchema);
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
export const getDistrict = createActionAsync(
  'get District by apartmentId',
  (apartmentId) => Utils.fetchJson(`/Apartment?filterType=and&filter[id]=${apartmentId}`)
    .then(throwIfNotFound('Apartment', apartmentId)),
  {
    noRethrow: true,
    ok: { payloadReducer: ({ request: [ apartmentId ], response: { included } }) => ({
      id: apartmentId,
      DistrictId: included.find((_included) => _included.type === 'district').id,
    }) },
  },
);

export const getDistrictDetails = createActionAsync(
  'get District by districtId',
  (districtId, apartmentId) => Utils.fetchJson(`/District?filterType=and&filter[id]=${districtId}`)
    .then(throwIfNotFound('District', districtId)),
  {
    noRethrow: true,
    ok: { payloadReducer: ({ request: [ districtId, apartmentId ], response: { data, included } }) => ({
      id: apartmentId,
      District: data
        .find((item) => item.type === 'district').attributes,
    }) },

  },
);

export const getHouseMates = createActionAsync(
  'get Housemates by ApartmentId',
  (apartmentId) => Utils.fetchJson(`/Apartment/house-mates?ApartmentId=${apartmentId}`),
  {
    noRethrow: true,
    ok: { payloadReducer: ({ request: [ apartmentId ] , response }) => ({
      id: apartmentId,
      HouseMates: response.map((room) => ({
        name: room.name,
        client: room.client,
        roomId: room.id,
        availableAt: room.availableAt,
      })),
    }) },
  },
);

export const getDistrictTerms = createActionAsync(
  'get nearbySchool by districtId',
  (districtId, apartmentId) => {
    const params = {
      'page[number]': 1,
      'page[size]': 100,
    };
    const qs = queryString.stringify(params, { encode: false });
    return Utils.fetchJson(`/Term?filterType=or&filter[TermableId]=${districtId}&${qs}`)
      .then(throwIfNotFound('District', districtId));
  },
  {
    noRethrow: true,
    ok: { payloadReducer: ({ request: [ districtId, apartmentId ], response: { data, included } }) => ({
      id: apartmentId,
      NearbySchools:  data
        .filter((_data) => _data.attributes.termable === 'District' && _data.attributes.taxonomy === 'nearbySchool')
        .map(({ attributes }) => attributes ),
    }) },
  },
);
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

      return Utils.fetchJson(
        `/OrderItem?filterType=and&filter[RentingId]=${rentingId}`
      );
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
  createActionAsync('List pictures',
    (roomId, apartmentId) => {
      if (roomId === undefined || apartmentId === undefined ) {
        return Promise.reject('Can only fetch by roomId or by ApartmentIdfor now');
      }

      const params = {
        'page[number]': 1,
        'page[size]': 100,
      };
      const qs = queryString.stringify(params, { encode: false });

      return Utils.fetchJson(`/Picture?filterType=or&filter[PicturableId]=${roomId},${apartmentId}&${qs}`);
    },
    { ok: { payloadReducer: ({ request: [ roomId, apartmentId ], response: { data, included } }) => ([{
      id: roomId,
      Pictures: data
        .filter((_data) => _data.attributes.picturable === 'Room')
        .map(({ attributes }) => attributes ),
    }, {
      id: apartmentId,
      Pictures: data
        .filter((_data) => _data.attributes.picturable === 'Apartment')
        .map(({ attributes }) =>  attributes  ),
    }]),
    } }
  );

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
        '/actions/update-terms',
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

export const savePictures =
  createActionAsync(
    'save Pictures of Room and Apartment in the backoffice',
    ({ roomId, apartmentId, ApartmentPictures, RoomPictures }) => (
      Utils.fetchJson(
        '/actions/update-pictures',
        {
          method: 'post',
          body: {
            roomId,
            apartmentId,
            RoomPictures,
            ApartmentPictures,
          },
        },
      )
    ),
    {
      noRethrow: true,
      error: { payloadReducer: (payload) => ({
        unauthorized: 'You must be log to the backoffice to update room\'s pictures',
      }) },
    },
  );

export const saveRoomAndApartment =
  createActionAsync(
    'save Room and Apartment in the backoffice',
    ({ room, apartment }) => (
      Utils.fetchJson(
        '/actions/update-apartment-and-room',
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
    (payment) => {
      const {
        cardNumber,
        cvv,
        expiryMonth,
        expiryYear,
        holderName,
        orderId,
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
      const error = JSON.parse(payload.error.message);

      if ( /fully paid/i.test(error.error) ) {
        return { errors: { payment: { hasWrongBalance: true } } };
      }
      if ( /not found/i.test(error.error) ) {
        return { errors: { payment: { hasNoOrder: true  } } };
      }
      if ( /invalid card type/i.test(error.error) ) {
        return { errors: { cardNumber: 'Invalid card type (only Visa and Mastercard are allowed)' } };
      }
      if ( /Invalid card/.test(error.error) ) {
        return { errors: { cardNumber: 'Invalid card number' } };
      }
      if ( /CVV2/i.test(error.error) ) {
        return { errors: { cvv: 'Invalid cvv' } };
      }
      if ( /no longer available/i.test(error.error) ) {
        return { errors: { payment: { isBooked: 'This room has been booked by someone else.' } } };
      }
      return { errors: { payment: { unexpected: error.error } } };
    } } },
  );

function throwIfNotFound(modelName, id) {
  return (response) => {
    if ( 'count' in response.meta && response.meta.count === 0 ) {
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
      .then(throwIfNotFound(modelName,id)
      ),
    { noRethrow: true,
      ok: { payloadReducer: ({ response }) => ({
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
