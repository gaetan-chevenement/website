import { IntlProvider, Text }           from 'preact-i18n';
import Footer                           from '~/components/Footer';
import DisplayPack                      from '~/components/booking/DisplayPack';
import FeatureList						from '~/components/booking/FeatureList';
import FeatureListPrice				    from '~/components/booking/FeatureListPrice';

export default function Services({ lang }) {
  return (
    <div>
      <IntlProvider definition={definition[lang]}>
        <div class="content service">
          <h1  class="services-title">
            <Text id="title.first">BOOK YOUR APARTMENT IN LESS THAN 1 MINUTE</Text><br /></h1>
          <dl class="grid-4 has-gutter-xl">
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/Step-one.png" />
              <h2 class="service-details"><strong><Text id="find.title">FIND</Text></strong></h2>
              <div>
                <p><Text id="find.subtitle.first">Your </Text><strong><Text id="find.subtitle.second">ideal apartment</Text></strong><Text id="find.subtitle.third"> from hundreds of flat shares and studios</Text></p>
              </div>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/Step-two.png" />
              <h2 class="service-details"><strong><Text id="choose.title">CHOOSE</Text></strong></h2>
              <div>
                <p><Text id="choose.subtitle.first">Your </Text><strong><Text id="choose.subtitle.second">Housing Pack</Text></strong><Text id="choose.subtitle.third"> from the list below. Payment allows us to complete your </Text><strong><Text id="choose.subtitle.fourth">booking</Text>!</strong></p>
              </div>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/Step-three.png" />
              <h2 class="service-details"><strong><Text id="arrive.title">ARRIVE</Text></strong></h2>
              <div>
                <p><Text id="arrive.subtitle.first">In the city with your baggage and pick up your </Text><strong><Text id="arrive.subtitle.second">keys</Text></strong>!</p>
              </div>
            </div>
            <div class="service-details">
              <img src="http://chez-nestor.com/wp-content/uploads/2016/04/Step-four.png" />
              <h2 class="service-details"><strong><Text id="move.title">MOVE IN</Text></strong></h2>
              <div>
                <p><Text id="move.subtitle.first">To your new home and </Text><strong><Text id="move.subtitle.second">enjoy our services</Text></strong><Text id="move.subtitle.third"> throughout your whole stay!</Text></p>
              </div>
            </div>
          </dl>
          <h1  class="services-title">
            <Text id="title.second">CHOOSE YOUR HOUSING PACK</Text><br /></h1>
          <p class="services-subtitle"><Text id="subtitle">All the different services throughout your stay depending on which Housing Pack you choose.</Text></p>
          <DisplayPack lang={lang} pack="comfort" />
          <div class="span-container">
            <p class="subtitle fancy"><span><Text id="packDetails">All the services included in your Housing Pack</Text></span></p>
          </div>
          <FeatureList lang={lang} />
          <FeatureListPrice lang={lang} />
          <span class="booking"><strong>Important</strong> | <Text id="deposit">The deposit and the Housing Pack are 2 different amoutns. The deposit is refunded. The Housing Pack is not.</Text></span>
        </div>
      </IntlProvider>
      <br />
      <br />
      <Footer />

    </div>
  );
}

const definition = { 'fr-FR': {
  packDetails: 'Tous les services inclus dans nos Packs Logements',
  title: {
    first: 'RÉSERVEZ VOTRE APPARTEMENT EN 1 MINUTE',
    second: 'CHOISISSEZ VOTRE PACK LOGEMENT',
  },
  subtitle: 'Différentes gammes de services pour votre appartement, tout au long du séjour',
  find: {
    title: 'TROUVEZ',
    subtitle: {
      first: 'Votre ',
      second: 'appartement idéal',
      third: ' parmi nos centaines d\'offres de colocations et studios.',
    },
  },
  choose: {
    title: 'CHOISISSEZ',
    subtitle: {
      first: 'Votre ',
      second: 'Pack Logement',
      third: ' parmi la liste ci-dessous. Son paiement finalise votre ',
      fourth: 'réservation',
    },
  },
  arrive: {
    title: 'VENEZ',
    subtitle: {
      first: 'A la ville avec vos bagages pour récupérer vos ',
      second: 'clés',
    },
  },
  move: {
    title: 'EMMÉNAGEZ',
    subtitle: {
      first: 'Dans votre nouvel appartement et ',
      second: 'profitez de nos services',
      third: ' tout au long de votre séjour',
    },
  },
} };
