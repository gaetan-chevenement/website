import { IntlProvider, Text } from 'preact-i18n';

function Availability({ lang, availableAt, classes }) {
  if ( availableAt === null ) {
    return (
      <IntlProvider definition={definition[lang]}>
        <div class={`${classes.common} ${classes.unavailable}`}>
          <Text id="unavailable">Unavailable</Text>
        </div>
      </IntlProvider>
    );
  }
  else if ( +availableAt > +Date.now() ) {
    return (
      <IntlProvider definition={definition[lang]}>
        <div class={`${classes.common} ${classes.availableFrom}`}>
          <Text id="availableFrom" fields={{ date: availableAt.toLocaleDateString() }}>
            {`Available from ${availableAt.toLocaleDateString()}`}
          </Text>
        </div>
      </IntlProvider>
    );
  }

  return (
    <IntlProvider definition={definition[lang]}>
      <div class={`${classes.common} ${classes.availableNow}`}>
        <Text id="availableNow">Available now</Text>
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  availableFrom: 'Dispo. le {{date}}',
} };

// /!\ This component cannot used the state because it's used inside leaflet
// and apparently these things are incompatible.
export default Availability;
