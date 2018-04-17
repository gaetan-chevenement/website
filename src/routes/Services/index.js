import { IntlProvider, Text } from 'preact-i18n';
import Footer                 from '~/components/Footer';
import Card                   from '~/components/Card';

export default function Services({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div class="content service">
        <h1>
          <Text id="title">Services included with your housing</Text>
        </h1>
        <p>
          <Text id="subtitle">
            At Chez Nestor, everything is included: we take care of it all so
            that you don't have to worry about anything and you can enjoy your
            apartment!
          </Text>
        </p>
        <div class="grid-5 has-gutter-xl">
          {services.map((service) => (
            <Card
              title={service[lang].title}
              content={service[lang].content}
              image={`/assets/services/${service.image}`}
            />
          ))}
        </div>
      </div>
      <Footer />
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  title: 'Services inclus avec votre logement',
  subtitle: 'Chez Nestor, tout est inclus : nous veillons à ce que vous n\'ayez à vous soucier de rien pour profiter de votre appartement !',
} };

const services = [{
  image: 'wifi.png',
  'en-US': {
    title: 'Wifi',
    content: 'High-speed, unlimited Wi-Fi in your apartment!',
  },
  'fr-FR': {
    title: 'Wifi',
    content: 'Connexion wifi illimitée et haut débit dans votre appartement !',
  },
}, {
  image: 'electricity.png',
  'en-US': {
    title: 'Electricity',
    content: 'Why wait in the dark for two weeks? Arrive and get plugged in - it\'s all ready!',
  },
  'fr-FR': {
    title: 'Électricité',
    content: 'Pourquoi attendre 15 jours dans le noir le passage d\'EDF ? Entrez, branchez, c\'est prêt !',
  },
}, {
  image: 'water.png',
  'en-US': {
    title: 'Water',
    content: 'Have a shower and make a cup of tea on your arrival... The water is included.',
  },
  'fr-FR': {
    title: 'Eau',
    content: 'Prenez une douche, faites-vous un thé... dès votre arrivée. L\'eau est incluse.',
  },
}, {
  image: 'gas.png',
  'en-US': {
    title: 'Gas',
    content: 'Gas for heating and cooking and the compulsory maintenance of your boiler are included!',
  },
  'fr-FR': {
    title: 'Gaz',
    content: 'Chauffage ou cuisinière, le gaz et la révision obligatoire de votre chaudière sont inclus !',
  },
}, {
  image: 'repairs.png',
  'en-US': {
    title: 'Repairs',
    content: 'Leaks or malfunctions? Our team will be there as soon as possible - and it\'s free!',
  },
  'fr-FR': {
    title: 'SAV',
    content: 'Fuite, panne... Pas de panique, notre équipe arrive au plus vite. Et c\'est gratuit.',
  },
}, {
  image: 'building.png',
  'en-US': {
    title: 'Building',
    content: 'Elevator, lighting and cleaning of your building… it\'s all included!',
  },
  'fr-FR': {
    title: 'Copro.',
    content: 'Ascenseur, lumière, ménage de l\'immeuble… tout est inclus !',
  },
}, {
  image: 'tax.png',
  'en-US': {
    title: 'Tax',
    content: 'Household Waste Tax? We take care of that too!',
  },
  'fr-FR': {
    title: 'Taxe',
    content: 'La taxe sur les ordures ménagères ? On s\'en occupe aussi !',
  },
}, {
  image: 'insurance.png',
  'en-US': {
    title: 'Insurance',
    content: 'Comprehensive Home Insurance is included for the apartment.',
  },
  'fr-FR': {
    title: 'Assurance',
    content: 'Votre assurance multirisque habitation est incluse pour l\'appartement.',
  },
}, {
  image: 'support.png',
  'en-US': {
    title: 'Support',
    content: 'Our team is at your service all stay round!',
  },
  'fr-FR': {
    title: 'Assistance',
    content: 'Tout au long de votre séjour, notre équipe est à votre service.',
  },
}, {
  image: 'subsidies.png',
  'en-US': {
    title: 'Subsidies',
    content: 'All of our apartments are eligible for the rent subsidy from the CAF.',
  },
  'fr-FR': {
    title: 'APL',
    content: '100% de nos appartements sont éligibles aux APL de la CAF.',
  },
}, {
  image: 'flexibility.png',
  'en-US': {
    title: 'Flexibility',
    content: 'You have an individual and personalized lease. Your stay is flexible in one of our flatshares!',
  },
  'fr-FR': {
    title: 'Flexibilité',
    content: 'Votre bail est individuel et personnalisé. En colocation chez nous, vous êtes flexible !',
  },
}, {
  image: 'furniture.png',
  'en-US': {
    title: 'Furniture',
    content: 'We have taken great care in furnishing your apartment tastefully.',
  },
  'fr-FR': {
    title: 'Meubles',
    content: 'Nous avons pris le plus grand soin pour meubler votre appartement avec goût.',
  },
}, {
  image: 'fittings.png',
  'en-US': {
    title: 'Fittings',
    content: 'Washing machine, dishwasher, microwave... You\'re kitted out from top to bottom!',
  },
  'fr-FR': {
    title: 'Équipements',
    content: 'Lave-linge, lave-vaisselle, micro-ondes... Vous êtes équipé(e) du sol au plafond !',
  },
}, {
  image: 'bedding.png',
  'en-US': {
    title: 'Bedding',
    content: 'Duvet, pillow, sheets... we even give you tempoary bedding for your first night.',
  },
  'fr-FR': {
    title: 'Literie',
    content: 'Couette, oreiller, draps... nous avons même pensé à votre première nuit.',
  },
}, {
  image: 'kitchen.png',
  'en-US': {
    title: 'Kitchen',
    content: 'Pots, pans, cutlery, utensils... There is everything you need to cook!',
  },
  'fr-FR': {
    title: 'Vaisselle',
    content: 'Casseroles, poêles, couverts, ustensiles... Tous est là pour vous faire de bons petits plats !',
  },
}];
