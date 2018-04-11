import { IntlProvider, Text } from 'preact-i18n';
import { Button }             from 'react-toolbox/lib/button/index';
import Utils                  from '~/utils';
import CSS                    from './style.css';

function CreateAlertButton({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <Button className={CSS.createAlertButton} icon="add_alert" theme={CSS}>
        <Text id="create">Create an alert</Text>
      </Button>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  create: 'Créer une alerte',
} };

export default Utils.connectLang(CreateAlertButton);
