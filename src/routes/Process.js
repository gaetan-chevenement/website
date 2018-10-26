import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { IntlProvider, Text } from 'preact-i18n';
import _const                 from '~/const';
import * as actions           from '~/actions';
import Card                   from '~/components/Card';
import PackList               from '~/components/PackList';
import FeatureList					  from '~/components/booking/FeatureList';

const { SEARCHABLE_CITIES } = _const;

class Services extends PureComponent {
  componentWillMount() {
    const { products, actions } = this.props;

    if ( !products || Object.keys(products).length === 0 ) {
      return Promise.all([
        actions.listProducts({ id: '*-pack' }),
        actions.listProducts({ id: '*-deposit' }),
      ]);
    }
  }

  render({ lang }) {
    const { packLines, depositLines } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <div class="content service">
          <h1>
            <Text id="steps">Book your apartment in less than 1 minute</Text>
          </h1>
          <div class="grid-4 has-gutter-xl">
            {steps.map((step) => (
              <Card
                title={step[lang].title}
                content={step[lang].content}
                image={`/assets/booking/${step.image}`}
              />
            ))}
          </div>
          <h1>
            <Text id="choose">Choose your housing pack</Text>
          </h1>
          <p>
            <Text id="subtitle">All the different services throughout your stay depending on which Housing Pack you have chosen:</Text>
          </p>
          <PackList pack="comfort" isPriceHidden />
          <h1>
            <Text id="comparison">Detailed comparison of the Housing Packs</Text>
          </h1>
          <FeatureList {...{ packLines, depositLines }} />
          <p>
            <b>Important</b> |
            <Text id="deposit">
              The deposit and the Housing Pack are 2 different amounts.
              The deposit is refundable while the Housing Pack is not.
            </Text>
          </p>
        </div>
      </IntlProvider>
    );
  }
}

const definition = {
  'fr-FR': {
    steps: 'Réservez votre appartement en moins d\'une minute',
    choose: 'Choisissez votre pack logement',
    subtitle: 'Différentes gammes de services pour votre appartement, tout au long du séjour, selon le pack choisi :',
    comparison: 'Comparaison détaillée des différents packs',
    deposit: 'La caution et le pack logement sont deux montants différents. La caution est remboursable, pas le pack logement.',
  },
  'es-ES': {
    steps: 'Reserva tu apartamento en menos de un minuto',
    choose: 'Elija su paquete de alojamiento',
    subtitle: 'Diferentes gamas de servicios para su apartamento, durante toda la estancia, según el pack elegido :',
    comparison: 'Comparación detallada de los diferentes envases',
    deposit: 'El depósito y el paquete de alojamiento son dos cantidades diferentes. El depósito es reembolsable, no el paquete de alojamiento.',
  },
};

const steps = [{
  image: 'step-one.png',
  'en-US': {
    title: 'Find',
    content: 'Your ideal apartment from hundreds of flat shares and studios.',
  },
  'fr-FR': {
    title: 'Trouvez',
    content: 'Votre appartement idéal parmi nos centaines d\'offres de colocations et studios.',
  },
  'es-ES': {
    title: 'Encuentre',
    content: 'su apartamento ideal entre cientos de pisos compartidos y estudios.',
  },
}, {
  image: 'step-two.png',
  'en-US': {
    title: 'Choose',
    content: 'Your Housing Pack from the list below. All our services are included in the pack and the payment allows us to complete your booking.',
  },
  'fr-FR': {
    title: 'Choisissez',
    content: 'Votre Pack Logement parmi la liste ci-dessous. Nos services sont inclus dedans et son paiement finalise votre réservation.',
  },
  'es-ES': {
    title: 'Elija',
    content: 'Su paquete de vivienda de la siguiente lista. Todos nuestros servicios están incluidos en el paquete y el pago nos permite completar su reserva.',
  },
}, {
  image: 'step-three.png',
  'en-US': {
    title: 'Arrive',
    content: 'In your new city with your baggage and pick up your keys.',
  },
  'fr-FR': {
    title: 'Venez',
    content: 'Dans votre nouvelle ville avec vos bagages pour récupérer vos clefs.',
  },
  'es-ES': {
    title: 'Llegue',
    content: 'A su nueva ciudad con su equipaje y recoger sus llaves.',
  },
}, {
  image: 'step-four.png',
  'en-US': {
    title: 'Move in',
    content: 'To your new home and enjoy our services throughout your whole stay!',
  },
  'fr-FR': {
    title: 'Emmenagez',
    content: 'Dans votre nouvel appartement et profitez de nos services tout au long de votre séjour.',
  },
  'es-ES': {
    title: 'Múdate',
    content: 'A su nuevo hogar y disfruta de nuestros servicios durante toda su estancia!',
  },
}];

function mapStateToProps({ route: { lang }, products }) {
  if ( products.isLoading || Object.keys(products).length === 0 ) {
    return { isLoading: true };
  }

  return {
    lang,
    products,
    packLines: SEARCHABLE_CITIES.map(({ name }) => {
      const city = name.toLowerCase();
      const prices = ['basic', 'comfort', 'privilege'].map((level) =>
        `${(products[`${city}-${level}-pack`] || {}).price / 100}€`
      );

      return [name, ''].concat(prices);
    }),
    depositLines: SEARCHABLE_CITIES.map(({ name }) => {
      const city = name.toLowerCase();
      const prices = [1,2,3].map(() =>
        `${(products[`${city}-deposit`] || {}).price / 100}€`
      );

      return [name, ''].concat(prices);
    }),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Services);
