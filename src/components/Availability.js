import { IntlProvider, Text } from 'preact-i18n';

function Availability({ lang, className, availableAt }) {
  let icon = <span class="material-icons">check_circle</span>;
  let text = <Text id="availableNow">Available now</Text>;
  let _className = `${className} availableNow`;

  if ( availableAt === null ) {
    icon = <span class="material-icons">remove_circle</span>;
    text = <Text id="unavailable">Unavailable</Text>;
    _className = `${className} unavailable`;
  }
  else if ( +availableAt > +Date.now() ) {
    icon = <span class="material-icons">warning</span>;
    text = (
      <Text id="availableFrom" fields={{ date: availableAt.toLocaleDateString() }}>
        {`Available from ${availableAt.toLocaleDateString()}`}
      </Text>
    );
    _className = `${className} availableFrom`;
  }

  return (
    <IntlProvider definition={definition[lang]}>
      <div className={_className}>
        {icon}{' '}
        {text}
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  availableFrom: 'Dispo. le {{date}}',
  unavailable: 'Plus disponible',
  availableNow: 'Disponible immédiatement',
} };

// /!\ This component cannot used the state because it's used inside leaflet
// and apparently these things are incompatible.
export default Availability;
