export const SameSearchCountOptions = {
  texts: {
    content: (count) => (
      `<b>${count} personnes</b> ont fait la <b>même recherche</b> cette semaine.`
    ),
  },
};

export const SearchResultsOptions = {
  pictos: {
    double: require('./assets/search/Picto description 4a.png'),
    simple: require('./assets/search/Picto description 4b.png'),
    sofa: require('./assets/search/Picto description 4c.png'),
  },
  bedNames: {
    double: 'Double couchage',
    simple: 'Lit simple',
    sofa: 'Canapé lit',
    multiple: '{n} couchages',
  },
};

export const SearchOptions = {
  texts: {
    introduction: {
      title: (town) => (`Colocations à ${town}`),
      content: (town, count) => (
        `Découvrez et comparez notre sélection de ${count} chambres en colocation à ${town}.
        Tous nos logements à ${town} sont entièrement meublés, équipé, tout inclus et en centre ville.
        Réservez en ligne ou visitez nos appartements et apportez juste votre valise : pour 1 mois, 1 semestre, 1 an...
        Louer une colocation à ${town} n'a jamais été aussi simple avec Chez Nestor !`
      ),
    },
  },
};

export const ContentServices = {
  texts: {
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
  img: require('./assets/home/gallery/home-gallery-1-o.jpg'),
  texts: {
    title: 'Guide logement gratuit',
    text: [
      'Où rechercher mon logement ?',
      'Quel dossier fournir pour un étudiant ?',
      'Quels sont les frais à prévoir pour une location ?',
    ],
    'button-download': 'Téléchargez votre guide logement offert',
  },
};

export const RoomServices = [
  {
    title: 'Meublés à 100%',
    img: require('./assets/home/experience-2-imageoptim.png'),
    desc: 'Nos logements sont meublés averc soin pour offrir design et confort',
  },
  {
    title: 'Equipés de A à Z',
    img: require('./assets/home/experience-3-imageoptim.png'),
    desc: 'N\'apportez que votre valise, nous gérons le reste !',
  },
  {
    title: 'Tout inclus',
    img: require('./assets/home/experience-4-imageoptim.png'),
    desc: 'Assurance, wifi, gaz... Aucun frais caché',
  },
  {
    title: 'Réservation rapide',
    img: require('./assets/home/experience-6-imageoptim.png'),
    desc: 'Quelques clics : réerver n\'a jamais été aussi simple',
  },
];
