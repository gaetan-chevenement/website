import { IntlProvider, Text } from 'preact-i18n';
import Footer           from '~/components/Footer';


export default function Services({ lang }) {
  return (
    <div>
      <IntlProvider definition={definition[lang]}>
        <div class="content service">
          <h1  class="services-title">
            <Text id="title">SERVICES INCLUDED IN YOUR APARTMENT</Text><br /></h1>
          <p class="services-subtitle"><Text id="subtitle">At Chez Nestor, everything is included: we take care of it all so that you don't have to worry about anything and you can enjoy your apartment!</Text></p>
          <dl class="grid-5 has-gutter-l">
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/connection-1.png" />
              <h2 class="service-details"><strong><Text id="wifi.title">WIFI</Text></strong></h2>
              <hr />
              <p><Text id="wifi.subtitle">High-speed, unlimited Wi-Fi in your apartment!</Text></p>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/technology-4.png" />
              <h2 class="service-details"><strong><Text id="electricity.title">ELECTRICITY</Text></strong></h2>
              <hr />
              <p><Text id="electricity.subtitle">Why wait in the dark for two weeks? Arrive and get plugged in - it's all ready!</Text></p>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/icon-1.png" />
              <h2 class="service-details"><strong><Text id="water.title">WATER</Text></strong></h2>
              <hr />
              <p><Text id="water.subtitle">Have a shower and make a cup of tea on your arrival... The water is included.</Text></p>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/cooking-1.png" />
              <h2 class="service-details"><strong><Text id="gas.title">GAS</Text></strong></h2>
              <hr />
              <p><Text id="gas.subtitle">Gas for heating and cooking and the compulsory maintenance of your boiler are included!</Text></p>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/wrench-1.png" />
              <h2 class="service-details"><strong><Text id="repairs.title">REPAIRS</Text></strong></h2>
              <hr />
              <p><Text id="repairs.subtitle">Leaks or malfunctions? Our team will be there as soon as possible - and it's free!</Text></p>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/arrows-1.png" />
              <h2 class="service-details"><strong><Text id="building.title">BUILDING</Text></strong></h2>
              <hr />
              <p><Text id="building.subtitle">Elevator, lighting and cleaning of your building... We pay for you.</Text></p>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/delete-1.png" />
              <h2 class="service-details"><strong><Text id="tax.title">TAX</Text></strong></h2>
              <hr />
              <p><Text id="tax.subtitle">Household Waste Tax? We take care of that too!</Text></p>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/weapon-1.png" />
              <h2 class="service-details"><strong><Text id="insurance.title">INSURANCE</Text></strong></h2>
              <hr />
              <p><Text id="insurance.subtitle">Comprehensive Home Insurance is included for the apartment</Text></p>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/phone-1.png" />
              <h2 class="service-details"><strong><Text id="support.title">SUPPORT</Text></strong></h2>
              <hr />
              <p><Text id="support.subtitle">Our team is at your service all year round!</Text></p>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/money.png" />
              <h2 class="service-details"><strong><Text id="subsidies.title">SUBSIDIES</Text></strong></h2>
              <hr />
              <p><Text id="subsidies.subtitle">All of our apartments are eligible for the rent subsidy from the CAF.</Text></p>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/tool.png" />
              <h2 class="service-details"><strong><Text id="flexibility.title">FLEXIBILITY</Text></strong></h2>
              <hr />
              <p><Text id="flexibility.subtitle">You have an individual and personalized lease. Your stay is flexible in one of our flatshares!</Text></p>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/Furnished.png" />
              <h2 class="service-details"><strong><Text id="furniture.title">FURNITURE</Text></strong></h2>
              <hr />
              <p><Text id="furniture.subtitle">We have taken great care in furnishing your apartment tastefully.</Text></p>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/Equuiped.png" />
              <h2 class="service-details"><strong><Text id="fittings.title">FITTINGS</Text></strong></h2>
              <hr />
              <p><Text id="fittings.subtitle">Washing machine, dishwasher, microwave... You're kitted out from top to bottom!</Text></p>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/rest.png" />
              <h2 class="service-details"><strong><Text id="bedding.title">BEDDING</Text></strong></h2>
              <hr />
              <p><Text id="bedding.subtitle">Duvet, pillow, sheets... we even give you tempoary bedding for your first night.</Text></p>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/eating.png" />
              <h2 class="service-details"><strong><Text id="kitchen.title">KITCHEN</Text></strong></h2>
              <hr />
              <p><Text id="kitchen.subtitle">Pots, pans, cutlery, utensils... There is everything you need to cook!</Text></p>
            </div>
          </dl>
        </div>
      </IntlProvider>
      <br />
      <br />
      <Footer />

    </div>
  );
}

const definition = { 'fr-FR': {
  title: 'SERVICES INCLUS DANS VOTRE APPARTEMENT',
  subtitle: 'Chez Nestor, tout est inclus : nous veillons à ce que vous n\'ayez à vous soucier de rien pour profiter de votre appartement !',
  wifi: {
    title: 'WIFI',
    subtitle: 'Connexion wifi illimitée et haut débit dans votre appartement !',
  },
  electricity: {
    title: 'ÉLECTRICITÉ',
    subtitle: 'Pour attendre 15 jours dans le noir le passage d\'EDF ? Entrez, branchez, c\'est prêt !',
  },
  water: {
    title: 'EAU',
    subtitle: 'Prenez une douche, faites-vous un thé... dès votre arrivée. L\'eau est incluse.',
  },
  gas: {
    title: 'GAZ',
    subtitle: 'Chauffage ou cuisinière, le gaz et la révision obligatoire de votre chaudière sont inclus !',
  },
  repairs: {
    title: 'SAV',
    subtitle: 'Fuite, panne... Pas de panique, notre équipe arrive au plus vite. Et c\'est gratuit.',
  },
  building: {
    title: 'COPRO.',
    subtitle: 'Ascenseur, lumière, ménage de l\'immeuble... Nous payons pour vous.',
  },
  tax: {
    title: 'TAXE',
    subtitle: 'La taxe sur les ordures ménagères ? C\'est pour nous aussi !',
  },
  insurance: {
    title: 'ASSURANCE',
    subtitle: 'Votre assurance multirisque habitation est incluse pour l\'appartement.',
  },
  support: {
    title: 'ASSISTANCE',
    subtitle: 'Tout au long de l\'année, notre équipe est à votre service.',
  },
  subsidies: {
    title: 'APL',
    subtitle: '100% de nos appartements sont éligibles aux APL de la CAF.',
  },
  flexibility: {
    title: 'FLEXIBILITÉ',
    subtitle: 'Votre bail est individuel et personnalisé. En colocation chez nous, vous êtes flexible !',
  },
  furniture: {
    title: 'MEUBLES',
    subtitle: 'Nous avons pris le plus grand soin pour meubler votre appartement avec goût.',
  },
  fittings: {
    title: 'ÉQUIPEMENT',
    subtitle: 'Lave-linge, lave-vaisselle, micro-ondes... Vous êtes équipé(e) du sol au plafond !',
  },
  bedding: {
    title: 'LITERIE',
    subtitle: 'Couette, oreiller, draps... nous avons même pensé à votre première nuit.',
  },
  kitchen: {
    title: 'VAISSELLE',
    subtitle: 'Casseroles, poêles, couverts, ustensiles... Tous est là pour vous faire de bons petits plats !',
  },
} };
