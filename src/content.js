export const SameSearchCountOptions = {
  min: 750,
  max: 950,
  texts: {
    content:
      '<b>{n} personnes</b> ont fait la <b>même recherche</b> cette semaine. Nous vous recommandons de réserver sans tarder !',
  },
};

export const SlideshowOptions = {
  images: [
    '/assets/home/gallery/home-gallery-1-o.jpg',
    '/assets/home/gallery/home-gallery-2-o.jpg',
    '/assets/home/gallery/home-gallery-3-o.jpg',
    '/assets/home/gallery/home-gallery-4-o.jpg',
    '/assets/home/gallery/home-gallery-5-o.jpg',
    '/assets/home/gallery/home-gallery-6-o.jpg',
    '/assets/home/gallery/home-gallery-7-o.jpg',
  ],
};

export const SearchResultsOptions = {
  imagesBaseUrl: 'http://chez-nestor.com/wp-content/uploads/',
  pictos: {
    double: require('./assets/search/Picto description 4a.png'),
    single: require('./assets/search/Picto description 4b.png'),
    sofa: require('./assets/search/Picto description 4c.png'),
  },
  bedNames: {
    double: 'Double couchage',
    single: 'Lit simple',
    sofa: 'Canapé lit',
    multiple: '{n} couchages',
  },
};

export const SearchOptions = {
  baseUrl: 'https://scqg8r1bs4.execute-api.eu-west-1.amazonaws.com/latest',
  params: {
    'page[number]': 1,
    'page[size]': 10,
  },
  segmentForTown: {
    Lyon: 'Available%20Rooms%20Lyon',
    Paris: 'Available%20Rooms%20Paris',
    Montpellier: 'Available%20Rooms%20Montpellier',
  },
  texts: {
    introduction: {
      title: 'Colocations à {{town}}',
      content: `Découvrez et comparez notre sélection de {{count}} chambres en colocation à {{town}}.
        Tous nos logements à {{town}} sont entièrement meublés, équipé, tout inclus et en centre ville.
        Réservez en ligne ou visitez nos appartements et apportez juste votre valise : pour 1 mois, 1 semestre, 1 an...
        Louer une colocation à {{town}} n'a jamais été aussi simple avec Chez Nestor !`,
    },
  },
};

export const ContentSearchEngine = {
  texts: {
    title: 'Votre colocation prête à vivre',
    subtitle:
      "Trouvez aujourd'hui votre colocation meublée, équipée, tout inclus, en plein centre. ",
    'button-search': 'Rechercher',
  },
  icons: {
    place: require('./assets/search/Picto search 1.png'),
    date: require('./assets/search/Picto search 2.png'),
    amount: require('./assets/search/Picto search 3.png'),
  },
};

export const ContentTowns = {
  list: [
    {
      name: 'Lyon',
      roomsCount: 328,
      image: '/assets/home/cities/lyon-imageoptim.jpg',
      searchable: true,
    },
    {
      name: 'Montpellier',
      roomsCount: 64,
      image: '/assets/home/cities/montpellier-imageoptim.jpg',
      searchable: true,
    },
    {
      name: 'Paris',
      roomsCount: 500,
      image: '/assets/home/cities/paris-imageoptim.jpg',
      searchable: true,
    },

    /*
    {
      name: 'Aix en Provence',
      roomsCount: 250,
      image: '/assets/home/Ville - Aix en Provence - CC0 Creative Commons - Wikimedia.jpg',
    },
    {
      name: 'Bordeaux',
      roomsCount: 127,
      image: './assets/home/Ville - Bordeaux - CC0 Creative Commons - Pixabay.jpg',
    },
    {
      name: 'Grenoble',
      roomsCount: 126,
      image: './assets/home/Ville - Grenoble - CC0 Creative Commons - Wikimedia.jpg',
    },
    {
      name: 'Le Havre',
      roomsCount: 222,
      image: './assets/home/Ville - Le Havre - CC0 Creative Commons - Wkipedia.JPG',
    },
    {
      name: 'Lille',
      roomsCount: 645,
      image: './assets/home/Ville - Lille - CC0 Creative Commons - Wikipedia.JPG',
    },
    {
      name: 'Marseille',
      roomsCount: 324,
      image: './assets/home/Ville - Marseille - CC0 Creative Commons - Wikimedia.jpg',
    },
    {
      name: 'Nantes',
      roomsCount: 223,
      image: './assets/home/Ville - Nantes - CC0 Creative Commons - Wikipedia.JPG',
    },
    {
      name: 'Nice',
      roomsCount: 544,
      image: './assets/home/Ville - Nice - CC0 Creative Commons - Pixabay.jpg',
    },
    {
      name: 'Reims',
      roomsCount: 24,
      image: './assets/home/Ville - Reims - CC0 Creative Commons - Wikimedia.jpg',
    },
    {
      name: 'Rennes',
      roomsCount: 6425,
      image: './assets/home/Ville - Rennes - CC0 Creative Commons - Wikipedia.JPG',
    },
    {
      name: 'Saint Etienne',
      roomsCount: 53,
      image: './assets/home/Ville - Saint Etienne - CC0 Creative Commons - Wikipedia.jpg',
    },
    {
      name: 'Strasbourg',
      roomsCount: 23,
      image: './assets/home/Ville - Strasbourg - CC0 Creative Commons - Pixabay.jpg',
    },
    {
      name: 'Toulon',
      roomsCount: 343,
      image: './assets/home/Ville - Toulon - CC0 Creative Commons - Wikipedia.jpg',
    },
    {
      name: 'Toulouse',
      roomsCount: 555,
      image: './assets/home/Ville - Toulouse - CC0 Creative Commons Wikimedia.jpg',
    },
    */
  ],
  texts: {
    title: 'Découvrez les villes Chez Nestor',
  },
};

export const ContentServices = {
  texts: {
    title: 'Une nouvelle expérience de la colocation',
    'button-discover': 'Découvrez nos services inclus',
  },
  list: [
    {
      title: 'Plein centre',
      img: require('./assets/home/experience-1-imageoptim.png'),
      subtitle: 'Au cœur de la ville',
    },
    {
      title: 'Meublé',
      img: require('./assets/home/experience-2-imageoptim.png'),
      subtitle: 'De A à Z',
    },
    {
      title: 'Equipé',
      img: require('./assets/home/experience-3-imageoptim.png'),
      subtitle: 'Du sol au plafond',
    },
    {
      title: 'Tout inclus',
      img: require('./assets/home/experience-4-imageoptim.png'),
      subtitle: 'Assurance, eau, gaz...',
    },
    {
      title: 'Wifi',
      img: require('./assets/home/experience-5-imageoptim.png'),
      subtitle: 'Haut débit',
    },
    {
      title: '3 clics',
      img: require('./assets/home/experience-6-imageoptim.png'),
      subtitle: 'Pour réserver',
    },
  ],
};

export const ContentTestimonies = {
  texts: {
    title: 'Nos colocataires nous recommandent',
  },
  list: [
    {
      avatar: require('./assets/home/testimony-anna-imageoptim.jpg'),
      title: 'Service parfait',
      note: 5,
      comment:
        'L\'équipe a été très utile et agréable pendant tout mon séjour. Mon installation a été facile et rapide. L\'entretien du logement était impeccable. Merci :)',
      author: 'Anna, 22 ans, australienne',
    },
    {
      avatar: require('./assets/home/testimony-max-imageoptim.jpg'),
      note: 5,
      title: 'Appartement très confortable',
      comment:
        'J\'ai beaucoup apprécié de découvrir la ville avec mes colocs et me concentrer sur mes études : tout est déjà prêt dans le logement, il n\'y a plus rien à s\'occuper.',
      author: 'Max, 25 ans, allemand',
    },
    {
      avatar: require('./assets/home/testimony-emilie-imageoptim.jpg'),
      note: 5,
      title: 'Super simple',
      comment:
        'La réservation est super simple, et j\'ai adoré avoir des colocataires internationaux. J\'ai déjà testé le service dans 3 villes depuis 2 ans pour des stages et semestres.',
      author: 'Emilie, 23 ans, française',
    },
  ],
};

export const ContentGuide = {
  assets: {
    image: require('./assets/home/gallery/home-gallery-1-o.jpg'),
  },
  texts: {
    title: 'Guide logement gratuit',
    text: [
      'Où rechercher mon logement ?',
      'Quel dossier fournir pour un étudiant ?',
      'Quels sont les frais à prévoir pour une location',
      'Qui sont les différents acteurs du logement ?',
    ],
    'button-download': 'Téléchargez votre guide logement offert',
  },
};
