import { IntlProvider, Text, Localizer } from 'preact-i18n';

export default function Heading({ lang, room, type }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <h1 class="grid has-gutter-xl">
        <div class="two-thirds">
          <Text id="title" fields={{ type }}>{type} for room</Text><br />
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

const definition = { 'fr-FR': {
  title: '{type} de la chambre',
  alt: 'Photo de couverture de la chambre',
} };
