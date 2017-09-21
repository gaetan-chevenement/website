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
      basic:      89000,
      comfort:   119000,
      privilege: 149000,
    },
  },

  DEPOSIT_PRICES: {
    lyon:        70000,
    paris:       90000,
    montpellier: 50000,
  },

  SPECIAL_CHECKIN_PRICE: 7900,

  SERVICE_FEES: {
    1:       5000, // 1 room
    2:       4000, // 2 rooms
    default: 3000, // 3 or more rooms
  },

  UNAVAILABLE_DATE: new Date(1E14),

  API_BASE_URL: ((environment) => {
    switch (environment) {
    case 'production':
      return 'https://scqg8r1bs4.execute-api.eu-west-1.amazonaws.com/latest/forest';
    case 'staging':
      return 'https://7789dwm2t3.execute-api.eu-west-1.amazonaws.com/latest/forest';
      // return 'https://ucyldwzph9.execute-api.eu-west-1.amazonaws.com/staging/forest';
    default:
      return 'http://localhost:3000/forest';
    }
  })(process.env.PREACT_APP_ENV),

  IDENTITY_FORM_URL: 'https://forms.chez-nestor.com/50392735671964',
};
