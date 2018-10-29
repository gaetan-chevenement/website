import { IntlProvider, Text } from 'preact-i18n';
import { Button }             from 'react-toolbox/lib/button';
import Utils                  from '~/utils';

function Questions({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div>
        <Button raised icon="phone" href="tel:0033972323102">
          <Text id="phoneNumber">+33 972 323 102</Text>
        </Button>
        <p>
          <Text id="opening">Monday to Friday from 9am to 6pm</Text>
        </p>
      </div>
    </IntlProvider>
  );
}

const definition = {
  'fr-FR': {
    phoneNumber: '0 972 323 102',
    opening: 'Du lundi au vendredi de 9h à 18h',
  },
  'es-ES': {
    phoneNumber: '+33 972 323 102',
    opening: 'De lunes a viernes, de las 9 a las 18 horas',
  },
};

export default Utils.connectLang(Questions);
