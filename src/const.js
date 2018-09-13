import common from 'cheznestor-common/const';

export default Object.assign({}, common, {
  API_BASE_URL: ((environment) => {
    switch (environment) {
    case 'production':
      return 'https://ucyldwzph9.execute-api.eu-west-1.amazonaws.com/production/forest';
    case 'staging':
      return 'https://ucyldwzph9.execute-api.eu-west-1.amazonaws.com/staging/forest';
    default:
    case 'development':
      return 'http://localhost:3000/forest';
    }
  })(process.env.PREACT_APP_ENV),

  MAPBOX_TOKEN: `pk.eyJ1IjoiY2hlem5lc3RvciIsImEiOiJjajhtdzhkMGQxMXRqMndsZHRyaXo0ZXhsIn0.8nTAH6da3pvqHKYAARms5A`,

  BLOG_URL: 'https://blog.chez-nestor.com',

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

  APP_HTML_LANG: {
    'en-US': 'en',
    'fr-FR': 'fr',
    'es-ES': 'es',
  },

  SEARCH_PAGE_TITLE_TEMPLATE: {
    'en-US': 'Rooms in {city} on {date}',
    'fr-FR': 'Chambres à {city} le {date}',
    'es-ES': 'Habitaciones en {city} el {date}',
  },

  CRISP_SCRIPT: `
    window.$crisp=[];window.CRISP_WEBSITE_ID="25c594c7-3fd4-4b61-b3d5-7416747ff5ac";
    (function(){d=document;s=d.createElement("script");
    s.src="https://client.crisp.chat/l.js";s.async=1;
    d.getElementsByTagName("head")[0].appendChild(s);})();
  `,

  GTM_SCRIPT: `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-WCRQV25');
  `,

  PIXEL_SCRIPT: `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '410162552777679');
    fbq('track', 'PageView');
  `,
});
