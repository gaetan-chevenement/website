import { IntlProvider, Text }       from 'preact-i18n';
import FeatureList						from '~/components/booking/FeatureList';
import PackPicker							from './PackPicker';
import CheckinInputs			    from './CheckinInputs';
import ClientInputs			      from './ClientInputs';
import EligibilityInput		   	from './EligibilityInput';

export default function({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div>
        <section>
          <ClientInputs />
        </section>

        <section>
          <h3><Text id="housingPack">Choose Your Housing Pack</Text></h3>
          <PackPicker />
        </section>

        <section>
          <h3><Text id="detail">Detailed comparison</Text></h3>
          <FeatureList lang={lang} />
        </section>

        <section>
          <h3><Text id="date.first">Planned date and time of check-in</Text></h3>
          <p><Text id="date.last">(This can be changed at any time.)</Text></p>
          <CheckinInputs />
        </section>

        <section>
          <h3><Text id="eligibility">Eligibility, Terms and Conditions</Text></h3>
          <EligibilityInput />
        </section>
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  housingPack: 'Choisissez Votre Pack Logement',
  detail: 'Comparaison Détaillée',
  date: {
    first: 'Date et heure prévues de checkin',
    last: '(Possibilité de changer à n\'importe quel moment)',
  },
  eligibility: 'Eligibilité, modalités et Conditions',
} };
