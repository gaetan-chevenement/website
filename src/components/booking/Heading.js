import { IntlProvider, Text, Localizer }  from 'preact-i18n';
import Utils                              from '~/utils';

function Heading({ lang, room, type }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <h1 class="grid has-gutter-xl">
        <div class="two-thirds">
          {definition[lang][type]}&nbsp;
          <Text id="forRoom">for</Text><br />
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
    details: 'Booking details',
    summary: 'Booking summary',
    confirmed: 'Book confirmation',
  },
  'fr-FR': {
    forRoom: 'pour',
    details: 'Détails de la réservation',
    summary: 'Récapitulatif de la réservation',
    confirmed: 'Confirmation de la réservation',
    alt: 'Photo de couverture de la chambre',
  },
};

export default Utils.connectLang(Heading);
