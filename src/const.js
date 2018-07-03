import common from 'cheznestor-common/const';

export default Object.assign({}, common, {
  API_BASE_URL: ((environment) => {
    switch (environment) {
    case 'production':
      return 'https://ucyldwzph9.execute-api.eu-west-1.amazonaws.com/production/forest';
    default:
    case 'staging':
      return 'https://ucyldwzph9.execute-api.eu-west-1.amazonaws.com/staging/forest';
    }
  })(process.env.PREACT_APP_ENV),

  MAPBOX_TOKEN: `pk.eyJ1IjoiY2hlem5lc3RvciIsImEiOiJjajhtdzhkMGQxMXRqMndsZHRyaXo0ZXhsIn0.8nTAH6da3pvqHKYAARms5A`,

  RESULTS_PER_PAGE: 12,

  SEARCHABLE_CITIES: [{
    name: 'Lyon',
    roomsCount: 319,
    image: '/assets/home/cities/lyon-imageoptim.jpg',
  }, {
    name: 'Montpellier',
    roomsCount: 137,
    image: '/assets/home/cities/montpellier-imageoptim.jpg',
  }, {
    name: 'Paris',
    roomsCount: 92,
    image: '/assets/home/cities/paris-imageoptim.jpg',
  }, {
    name: 'Lille',
    roomsCount: 55,
    image: '/assets/home/cities/lille-imageoptim.jpg',
  }, {
    name: 'Toulouse',
    roomsCount: 52,
    image: '/assets/home/cities/toulouse-imageoptim.jpg',
  }],
});
