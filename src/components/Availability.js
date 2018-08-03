import { IntlProvider, Text } from 'preact-i18n';

function Availability({ lang, className, availableAt, arrivalDate }) {
  let icon = <span class="material-icons">check_circle</span>;
  let text = <Text id="availableNow">Available now</Text>;
  let _className = `${className} availableNow`;

  if ( availableAt === null ) {
    icon = <span class="material-icons">remove_circle</span>;
    text = <Text id="unavailable">Unavailable</Text>;
    _className = `${className} unavailable`;
  }
  else if ( +availableAt > +Date.now() ) {
    let date = availableAt.toLocaleDateString().replace(/\/\d{4}/, '');
    text = (
      <Text id="availableFrom" fields={{ date }}>
        {`Available from ${date}`}
      </Text>
    );
    if ( arrivalDate != null && (+availableAt > +arrivalDate) ) {
      icon = <span class="material-icons">warning</span>;
      _className = `${className} availableFrom`;
    }
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

const definition = {
 'fr-FR': {
  availableFrom: 'Dispo. le {{date}}',
  unavailable: 'Plus disponible',
  availableNow: 'Dispo. immédiatement',
 }, 
 'es-ES': {
  availableFrom: 'Disponible en {{date}}',
  unavailable: 'Ya no está disponible',
  availableNow: 'Disponible inmediatamente',
 }, 
};

// /!\ This component cannot used the state because it's used inside leaflet
// and apparently these things are incompatible.
export default Availability;
