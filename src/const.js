import common from 'cheznestor-common/const';

export default Object.assign({}, common, {
  API_BASE_URL: ((environment) => {
    switch (environment) {
    case 'production':
      return 'https://ucyldwzph9.execute-api.eu-west-1.amazonaws.com/production/forest';
    case 'staging':
      return 'https://ucyldwzph9.execute-api.eu-west-1.amazonaws.com/staging/forest';
    default:
      return 'https://ucyldwzph9.execute-api.eu-west-1.amazonaws.com/staging/forest';
    }
  })(process.env.PREACT_APP_ENV),

  ROOM_SEGMENTS: {
    lyon: 'Available%20Rooms%20Lyon',
    paris: 'Available%20Rooms%20Paris',
    montpellier: 'Available%20Rooms%20Montpellier',
  },

  MAPBOX_TOKEN: `pk.eyJ1IjoiY2hlem5lc3RvciIsImEiOiJjajhtdzhkMGQxMXRqMndsZHRyaXo0ZXhsIn0.8nTAH6da3pvqHKYAARms5A`,
});
