import { IntlProvider, Text } from 'preact-i18n';
import { Button }             from 'react-toolbox/lib/button';
import Utils                  from '~/utils';
import _const                 from '~/const';
import PhoneButton            from '~/components/PhoneButton';

const { SALES_EMAIL, SUPPORT_EMAIL } = _const;

export default function Services({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div class="content">
        <h1>
          <Text id="title">Let's get in touch</Text>
        </h1>
        <div class="grid-2">
          <div>
            <h3>
              <Text id="address">Address</Text>
            </h3>
            <p>
              Chez Nestor<br />
              16 rue de Condé<br />
              69002 Lyon
            </p>
            <h3><Text id="phone">Phone number</Text></h3>
            <PhoneButton />
          </div>
          <div>
            <h3>Emails</h3>
            <p>
              <Button raised icon="email" href={`mailto:${SALES_EMAIL}`}>
                <Text id="sales">Request for information</Text>
              </Button>
              <br /><br />
              <Button raised icon="email" href={`mailto:${SUPPORT_EMAIL}`}>
                <Text id="support">Customer support</Text>
              </Button>
            </p>
            <h3>Chat</h3>
            <p>
              <Button onClick={Utils.getEnquireHandler()}
                raised icon="question_answer"
              >
                <Text id="openChat">Open chat</Text>
              </Button>
            </p>
          </div>
        </div>
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  title: 'Prenons contact !',
  address: 'Adresse',
  sales: 'Demande d\'informations',
  support: 'Support client',
  phone: 'Numéro de téléphone',
  openChat: 'Ouvrir la messagerie',
} };
