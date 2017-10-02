// TODO: switch this back to esnext import once preact-cli is better integrated
// with Jest
const yup                         = require('yup');
const D                           = require('date-fns');
const memoize                     = require('memoize-immutable');
const reduce                      = require('lodash/reduce');
const holidays                    = require('./holidays.json');
const {
  SPECIAL_CHECKIN_PRICE,
  UNAVAILABLE_DATE,
}                                 = require('./const');

const _ = { reduce };

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
  getCheckinPrice(date, level) {
    const startOfDay = D.startOfDay(date);
    const isWorkingHours = D.isWithinRange(
      date,
      D.addHours(startOfDay, 9),
      D.addHours(startOfDay, 18)
    );
    const isSpecialDate =
      D.isWeekend(date) || !isWorkingHours || Utils.isHoliday(date);

    return level === 'basic' && isSpecialDate ?
      SPECIAL_CHECKIN_PRICE : 0;
  },
  isRoomAvailable(room) {
    return D.compareAsc( room.availableAt, UNAVAILABLE_DATE ) !== 0;
  },
  getBookingDate({ availableAt }, now = new Date()) {
    return D.compareAsc( availableAt, now ) === -1 ? now : availableAt;
  },
  classifyRentingOrders({ rentingId, orders }) {
    return Object.values(orders)
      // filter orders related to that renting
      .filter((order) => (
        order.OrderItems.some((item) => item.RentingId === rentingId)
      ))
      .reduce((orders, order) => {
        if ( order.type === 'deposit' ) {
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
  transformCardNumber(value) {
    return value.replace(' ', '').replace(/(\d{4})/g, '$1 ');
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
    return rooms;
  },
};

const currYear = pureUtils.getCurrYear();
const Utils = {
  _pure: pureUtils,

  bookingSchema: yup.object().shape({
    bookingDate: yup.date().required(),
    pack: yup.string().required(),
    firstName: yup.string().required().trim(),
    lastName: yup.string().required().trim(),
    email: yup.string().email().required().trim(),
    checkinDate: yup.date().required().min(
      yup.ref('bookingDate'),
      'Checkin cannot happen before the booking date'
    ),
    isEligible: yup.boolean().required().test({
      name: 'is-elibible',
      message: 'You must verify your eligibility and agree to our terms of service',
      test: Boolean,
    }),
  }),

  cardSchema: yup.object().shape({
    holderName: yup.string().required().trim(),
    cardNumber:
      yup.string().transform(pureUtils.transformCardNumber).required().matches(/^(\d{4} ){4}$/),
    expiryMonth:
      yup.number().integer().required().min(1).max(12),
    expiryYear:
      yup.number().integer().required().min(currYear).max(currYear + 10),
    cvv:
      yup.string().required().matches(/^\d{3}/),
  }),
};

for ( let fnName in pureUtils ) {
  if ( typeof pureUtils[fnName] === 'function' ) {
    Utils[fnName] = memoize(pureUtils[fnName]);
  }
}

module.exports = Utils;
