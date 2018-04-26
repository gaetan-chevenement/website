import { IntlProvider, Text } from 'preact-i18n';
import { Button }             from 'react-toolbox/lib/button/index';
import _const                 from '~/const';
import Utils                  from '~/utils';
import CSS                    from './style.css';

const { ALERT_FORM_URL } = _const;

function CreateAlertButton({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <Button className={CSS.createAlertButton} icon="add_alert" theme={CSS}
        href={ALERT_FORM_URL} target="_blank"
      >
        <Text id="create">Create an alert</Text>
      </Button>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  create: 'Créer une alerte',
} };

export default Utils.connectLang(CreateAlertButton);
