module.exports = {
  PACK_PRICES: {
    lyon: {
      basic:      59000,
      comfort:    79000,
      privilege:  99000,
    },
    montpellier: {
      basic:      49000,
      comfort:    69000,
      privilege:  89000,
    },
    paris: {
      basic:      79000,
      comfort:    99000,
      privilege: 119000,
    },
  },

  DEPOSIT_PRICES: {
    lyon:        69000,
    paris:       89000,
    montpellier: 49000,
  },

  SPECIAL_CHECKIN_PRICE: 7900,

  SERVICE_FEES: {
    1:       5000, // 1 room
    2:       4000, // 2 rooms
    default: 3000, // 3 or more rooms
  },
};
