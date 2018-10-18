import { IntlProvider, Text, Localizer }  from 'preact-i18n';
import Utils                              from '~/utils';

function Heading({ lang, room, type }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <h1 class="grid has-gutter-xl">
        <div class="two-thirds">
          {definition[lang][type]}&nbsp;
          <Text id="forRoom" /><br />
          <em>{room.name}</em>
        </div>
        <div class="one-third">
          <Localizer>
            <img src={room['pic 0 url']}
              alt={<Text id="alt">Cover picture of the room</Text>}
              style="width: 100%"
            />
          </Localizer>
        </div>
      </h1>
    </IntlProvider>
  );
}

const definition = {
  'en-US': {
    forRoom: 'of',
    details: 'Booking details',
    summary: 'Booking summary',
    confirmed: 'Book confirmation',
  },
  'fr-FR': {
    forRoom: 'de',
    details: 'Détails de la réservation',
    summary: 'Récapitulatif de la réservation',
    confirmed: 'Confirmation de la réservation',
    alt: 'Photo de couverture de la chambre',
  },
  'es-ES': {
    forRoom: 'de',
    details: 'Detalles de la reserva',
    summary: 'Resumen de la reserva',
    confirmed: 'Confirmación de la reserva',
    alt: 'Fotografía de portada de la habitación',
  },
};

export default Utils.connectLang(Heading);
