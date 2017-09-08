import { createAction }        from 'redux-act';
import { createActionAsync }   from 'redux-act-async';
import Promise                 from 'bluebird';
import Utils                   from '~/utils';
import {
  API_BASE_URL,
}                              from '~/const';

export const updateRoute = createAction('Update route');

export const {
  updateBooking,
  setBookingErrors,
  deleteBookingError,
  validateBooking,
} = createFormAction('Booking', Utils.bookingSchema);
export const {
  updateCard,
  setCardErrors,
  deleteCardError,
  validateCard,
} = createFormAction('Card', Utils.cardSchema);

export const getRoom =
  createActionAsync(
    'get Room by id',
    (id) => fetchJson(`/Room?filterType=and&filter[id]=${id}&segment=Availability`),
    { ok: { payloadReducer: ({ response: { data, included } }) => ({
      room: {
        ...data[0].attributes,
        ApartmentId: data[0].relationships.Apartment.data.id,
      },
      apartment: included[0].attributes,
      bookingDate: data[0].attributes.availableAt,
    }) } }
  );
export const getRenting = createGetActionAsync('Renting');
export const getApartment = createGetActionAsync('Apartment');
export const getOrder =
  createActionAsync(
    'get Order and associated OrderItems by Order id',
    (id) => fetchJson(`/OrderItem?filterType=and&filter[OrderId]=${id}`),
    { ok: { payloadReducer: ({ response: { data, included } }) => ({
      ...( included.find((inc) => inc.type === 'order').attributes ),
      OrderItems: data.map(mapItem),
    }) } }
  );
export const listOrders =
  createActionAsync(
    'list Orders and associated OrderItems',
    ({ rentingId }) => {
      if ( rentingId === undefined ) {
        return Promise.reject('Can only fetch by rentingId for now');
      }

      return fetchJson(`/OrderItem?filterType=and&filter[RentingId]=${rentingId}`);
    },
    { ok: { payloadReducer: ({ response: { data, included } }) => (
      included
        .filter((inc) => inc.type === 'order')
        .map((order) => {
          order.OrderItems =
            data
              .filter((item) => (
                item.relationships.Order.data.id === order.id
              ))
              .map(mapItem);
          return order;
        })
    ) } }
  );
export const createRenting =
  createActionAsync(
    'create Renting and associated client',
    ({ room, booking }) => (
      fetchJson(
        '/actions/public/create-client-and-renting',
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomId: room.id,
            pack: booking.pack,
            client: booking,
            checkinDate: booking.checkinDate,
            currentPrice: room['current price'],
            bookingDate: booking.bookingDate,
          }),
        },
      )
    )
  );

function fetchJson(url, options) {
  return fetch(`${API_BASE_URL}${url}`, options)
    .then((result) => Promise.resolve(result.json()))
    .catch((error) => Promise.reject(error));
}

function createGetActionAsync(modelName) {
  return createActionAsync(
    `get ${modelName} by id`,
    (id) => fetchJson(`/${modelName}/${id}`),
    { ok: { payloadReducer: ({ response }) => response.data.attributes } }
  );
}

function createFormAction(formName, schema) {
  return {
    [`update${formName}`]: createAction(`Update ${formName} details`),
    [`set${formName}Errors`]: createAction(`Set ${formName} errors`),
    [`delete${formName}Error`]: createAction(`Delete a specific ${formName} error`),
    [`validate${formName}`]: createActionAsync(
      `Validate ${formName}`,
      (booking) => schema.validate(booking, { abortEarly: false })
    ),
  };
}

function mapItem(item) {
  return {
    ...item.attributes,
    RentingId: item.relationships.Renting.data.id,
    ProductId: item.relationships.Product.data.id,
  };
}
