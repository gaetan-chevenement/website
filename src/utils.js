// TODO: switch this back to esnext import once preact-cli is better integrated
// with Jest
const D                           = require('date-fns');
const Holidays                    = require('date-holidays');
const { SPECIAL_CHECKIN_PRICE }   = require('./const');

const h = new Holidays('FR');

const Utils = {
  roundBy100(value) {
    return Math.round( value / 100 ) * 100;
  },
  prorateFirstRent(amount, bookingDate) {
    const daysInMonth = D.getDaysInMonth(bookingDate);

    return Utils.roundBy100(
      amount / daysInMonth * (daysInMonth - D.getDate(bookingDate) + 1)
    );
  },
  getCheckinPrice(date, level) {
    const startOfDay = D.startOfDay(date);
    const isWorkingHours = D.isWithinRange(
      date,
      D.addHours(startOfDay, 9),
      D.addHours(startOfDay, 19)
    );
    const isSpecialDate =
      D.isWeekend(date) || !isWorkingHours(date) || h.isHoliday(date);

    return level === 'basic' && isSpecialDate(date) ?
      SPECIAL_CHECKIN_PRICE : 0;
  },
};

module.exports = Utils;
