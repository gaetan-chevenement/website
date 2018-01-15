// TODO: switch this back to esnext import once preact-cli is better integrated
// with Jest
import yup        from 'yup';
import D          from 'date-fns';
import memoize    from 'memoize-immutable';
import reduce     from 'lodash/reduce';
import filter     from 'lodash/filter';
import capitalize from 'lodash/capitalize';
import _const     from '~/const';
import holidays   from './holidays.json';

const _ = { reduce, filter, capitalize };
const {
  BASIC_PACK,
  SPECIAL_CHECKIN_FEES,
  UNAVAILABLE_DATE,
  API_BASE_URL,
  DEPOSIT_PRICES,
  PACK_PRICES,
} = _const;

const rCard = /^\d{16}$/;
const rVisa = /^4[0-9]{12}(?:[0-9]{3})?$/;
const rMastercard =
  /^(?:5[1-5][\d]{2}|222[1-9]|22[3-9][\d]|2[3-6][\d]{2}|27[01][\d]|2720)[\d]{12}$/;

const pureUtils = {
  roundBy100(value) {
    return Math.round( value / 100 ) * 100;
  },
  prorateFirstRent(amount, bookingDate) {
    const daysInMonth = D.getDaysInMonth(bookingDate);

    return Utils.roundBy100(
      amount / daysInMonth * (daysInMonth - D.getDate(bookingDate) + 1)
    );
  },
  isWorkingHours(date) {
    const startOfDay = D.startOfDay(date);

    return D.isWithinRange(
      date,
      D.addHours(startOfDay, 9),
      D.addHours(startOfDay, 18)
    );
  },
  isHoliday(date) {
    const sDate = date.toISOString();

    for ( let holiday of holidays ) {
      if ( sDate < holiday.end && sDate > holiday.start ) {
        return true;
      }

      if ( sDate < holiday.start ) {
        return false;
      }
    }

    return false;
  },
  isSpecialDate(date) {
    return D.isWeekend(date) || !Utils.isWorkingHours(date) || Utils.isHoliday(date);
  },
  getCheckinPrice(date, level, city) {
    if ( level === BASIC_PACK && Utils.isSpecialDate(date) ) {
      return SPECIAL_CHECKIN_FEES[city];
    }

    return 0;
  },
  isRoomAvailable(room) {
    return D.compareAsc( room.availableAt, UNAVAILABLE_DATE ) !== 0;
  },
  getBookingDate({ availableAt }, now = new Date()) {
    return D.compareAsc( availableAt, now ) === -1 ? now : availableAt;
  },
  classifyRentingOrders({ rentingId, orders }) {
    return Object.values(orders)
      // filter-out non-orders
      .filter((order) => typeof order === 'object' && 'id' in order)
      // filter orders related to that renting
      .filter((order) => (
        order.OrderItems.some((item) => item.RentingId === rentingId)
      ))
      .reduce((orders, order) => {
        if ( order.type === 'Deposit' ) {
          orders.deposit = order;
        }
        else if ( order.OrderItems.some((item) => /-pack$/.test(item.ProductId)) ) {
          orders.pack = order;
        }
        else {
          orders.rent = order;
        }

        return orders;
      }, {});
  },
  getFirstMonths(bookingDate) {
    return [0, 1, 2].map((offset) =>
      D.format(D.addMonths(bookingDate, offset), 'MMM')
    );
  },
  getCurrYear(now = new Date()) {
    return now.getFullYear() % 100;
  },
  hasErrors(object) {
    return Object.keys(object.errors).length > 0;
  },
  filterOutUndef(collection) {
    return _.reduce(collection, ( result, value, key ) => {
      if ( value !== undefined ) {
        result[key] = value;
      }

      return result;
    }, {});
  },
  getApartmentLatLng(apartment) {
    const latLngArr = apartment.latLng.split(',');

    return {
      lat: Number(latLngArr[0]),
      lng: Number(latLngArr[1]),
    };
  },
  // TODO: implement proper room filtering
  filterMatchingRooms(rooms) {
    return _.filter(rooms, (room) => ( typeof room === 'object' ));
  },
  getDepositLine(city) {
    return [_.capitalize(city), ''].concat([1,2,3].map(() =>
      `${DEPOSIT_PRICES[city] / 100}€`
    ));
  },
  getPackLine(city) {
    return [_.capitalize(city), '']
      .concat(['basic', 'comfort', 'privilege']
        .map((level) => `${PACK_PRICES[city][level] / 100}€`));
  },
  getPackLevel(order) {
    return order.OrderItems
      .find((item) => /-pack$/.test(item.ProductId))
      .ProductId.replace('-pack', '');
  },
  getCardType(number) {
    if ( !rCard.test(number) ) {
      return null;
    }
    if ( rVisa.test(number) ) {
      return 'visa';
    }
    if ( rMastercard.test(number) ) {
      return 'mastercard';
    }
    return null;
  },
};

const currYear = pureUtils.getCurrYear();
const Utils = {
  _pure: pureUtils,

  bookingSchema: yup.object().shape({
    pack: yup.string().required(),
    firstName: yup.string().required().trim(),
    lastName: yup.string().required().trim(),
    email: yup.string().email().required().trim(),
    isEligible: yup.boolean().required().test({
      name: 'is-elibible',
      message: 'You must verify your eligibility and agree to our terms of service',
      test: Boolean,
    }),
  }),

  paymentSchema: yup.object().shape({
    balance: yup.number().integer().required(),
    holderName: yup.string().required().trim(),
    cardNumber:
      yup.string().required()
        .transform((str) => str.replace(' ', ''))
        .test({
          name: 'is-valid-number',
          message: 'your card number isn\'t a valid MasterCard or Visa card number',
          test: pureUtils.getCardType,
        }),
    expiryMonth:
      yup.number().integer().required().min(1).max(12),
    expiryYear:
      yup.number().integer().required().min(currYear).max(currYear + 10),
    cvv:
      yup.string().required().matches(/^\d{3}/),
  }),

  fetchJson(_url, _options) {
    const options = { ..._options };
    const timezone =
      window.Intl &&
      window.Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/London';
    const url =
      `${API_BASE_URL}${_url}${/\?/.test(_url) ? '&' : '?'}timezone=${timezone}`;
    //options.credentials = 'include';
    // We assume we will only send json or FormData
    // (anything else will thus cause problems)
    if ( /^post$/i.test(options.method) ) {
      const isFormData = options.body instanceof FormData;

      options.headers = {
        ...options.headers,
        'Content-Type': `application/${isFormData? 'x-www-form-urlencoded' : 'json'}`,
      };
      if ( !isFormData && typeof options.body === 'object' ) {
        options.body = JSON.stringify(options.body);
      }
    }

    return fetch(url, options)
      .then((response) => {
        if ( !response.ok ) {
          /* eslint-disable promise/no-nesting */
          return response.text()
            .then((message) => {
              const error = new Error(message);

              window.Raven.captureException(error);
              throw error;
            });
          /* eslint-enable promise/no-nesting */
        }

        return response.json();
      })
      .catch((error) => {
        window.Raven.captureException(error);
        throw error;
      });
  },
};

for ( let fnName in pureUtils ) {
  if ( typeof pureUtils[fnName] === 'function' ) {
    Utils[fnName] = memoize(pureUtils[fnName]);
  }
}

export default Utils;
