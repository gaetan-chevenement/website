const D        = require('date-fns');
const Utils    = require('../src/utils');

describe('Utils', () => {
  describe('prorateFirstRent', () => {
    it('should return the price of one day when bookingDate is the last day of the month', () => {
      expect(Utils.prorateFirstRent(31000, D.parse('2015-01-31 Z'))).toEqual(1000);
    });

    it('should return the full rent when bookingDate is the last day of the month', () => {
      expect(Utils.prorateFirstRent(31000, D.parse('2015-01-01 Z'))).toEqual(31000);
    });

    it('should round results by 100', () => {
      expect(Utils.prorateFirstRent(31000, D.parse('2015-01-01 Z')) % 100).toEqual(0);
    });
  });

  describe('isHoliday', () => {
    const currYear = new Date().getFullYear();
    it('should return true when used on Fete Nat.', () => {
      expect(Utils.isHoliday(D.parse(`${currYear}-07-14 Z`))).toEqual(true);
    });

    it('should return false when used on Jan. 2nd', () => {
      expect(Utils.isHoliday(D.parse(`${currYear}-01-02 Z`))).toEqual(false);
    });
  });
});
