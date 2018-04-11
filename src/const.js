import common from 'cheznestor-common/const';

export default Object.assign({}, common, {
  API_BASE_URL: ((environment) => {
    switch (environment) {
    case 'production':
      return 'https://ucyldwzph9.execute-api.eu-west-1.amazonaws.com/production/forest';
    case 'staging':
      return 'https://ucyldwzph9.execute-api.eu-west-1.amazonaws.com/staging/forest';
    default:
      return 'http://localhost:3000/forest';
    }
  })(process.env.PREACT_APP_ENV),

  MAPBOX_TOKEN: `pk.eyJ1IjoiY2hlem5lc3RvciIsImEiOiJjajhtdzhkMGQxMXRqMndsZHRyaXo0ZXhsIn0.8nTAH6da3pvqHKYAARms5A`,

  RESULTS_PER_PAGE: 12,

  SEARCHABLE_CITIES: [{
    name: 'Lyon',
    roomsCount: 300,
    image: '/assets/home/cities/lyon-imageoptim.jpg',
  }, {
  //   name: 'Lyon 3e 6e 7e 8e',
  // }, {
  //   name: 'Lyon 1er 2e 4e',
  // }, {
  //   name: 'Lyon 5e 9e',
  // }, {
    name: 'Montpellier',
    roomsCount: 120,
    image: '/assets/home/cities/montpellier-imageoptim.jpg',
  }, {
    name: 'Paris',
    roomsCount: 70,
    image: '/assets/home/cities/paris-imageoptim.jpg',
  }, {
    name: 'Lille',
    roomsCount: 20,
    image: '/assets/home/cities/lille-imageoptim.jpg',
  }, {
    name: 'Toulouse',
    roomsCount: 20,
    image: '/assets/home/cities/toulouse-imageoptim.jpg',
  }],
});
