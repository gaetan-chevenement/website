import { IntlProvider, Text } from 'preact-i18n';
import Card                   from '~/components/Card';
import PackList               from '~/components/PackList';
import FeatureList					  from '~/components/booking/FeatureList';

export default function Services({ lang }) {
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
        <FeatureList />
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

const definition = {
  'fr-FR': {
    steps: 'Réservez votre appartement en moins d\'une minute',
    choose: 'Choisissez votre pack logement',
    subtitle: 'Différentes gammes de services pour votre appartement, tout au long du séjour, selon le pack choisi :',
    comparison: 'Comparaison détaillée des différents packs',
    deposit: 'La caution et le pack logement sont deux montants différents. La caution est remboursable, pas le pack logement.',
  },
  'es-ES': {
    steps: 'Reserva su apartamento en menos de un minuto',
    choose: 'Elija su Housing Pack',
    subtitle: 'Distintas gamas de servicios para su apartamento, a lo largo de su estancia, según el pack elegido :',
    comparison: 'Comparación detallada de los diferentes Packs',
    deposit: 'La fianza y el Housing Pack son dos distintos importes. La fianza es un importe reembolsable pero no el Housing Pack.',
  },
};

const steps = [{
  image: 'step-one.png',
  'en-US': {
    title: 'Find',
    content: 'Your ideal apartment from hundreds of flat shares.',
  },
  'fr-FR': {
    title: 'Trouvez',
    content: 'Votre appartement idéal parmi nos centaines d\'offres de colocations.',
  },
  'es-ES': {
    title: 'Encuentre',
    content: 'el apartamento de sus sueños entre nuestras centenas de viviendas compartidas.',
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
    content: 'su Housing Pack en la siguiente lista. Todos nuestros servicios están incluidos en el Housing Pack y su pago finaliza su reserva.',
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
    content: 'A su nueva ciudad con su equipaje para recoger sus llaves.',
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
    title: 'Múdense',
    content: 'A su nuevo apartamento y disfruta de nuestros servicios durante toda su estancia!',
  },
}];
