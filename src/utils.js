// TODO: switch this back to esnext import once preact-cli is better integrated
// with Jest
const D                           = require('date-fns');
const holidays                    = require('./holidays.json');
const { SPECIAL_CHECKIN_PRICE }   = require('./const');

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
      D.addHours(startOfDay, 19)
    );
    const isSpecialDate =
      D.isWeekend(date) || !isWorkingHours || Utils.isHoliday(date);

    return level === 'basic' && isSpecialDate ?
      SPECIAL_CHECKIN_PRICE : 0;
  },
};

module.exports = Utils;
