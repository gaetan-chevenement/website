import { IntlProvider }       from 'preact-i18n';
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
          <h3>Choose Your Housing Pack</h3>
          <PackPicker />
        </section>

        <section>
          <h3>Detailed comparison</h3>
          <FeatureList />
        </section>

        <section>
          <h3>Planned date and time of check-in</h3>
          <p>(This can be changed at any time.)</p>
          <CheckinInputs />
        </section>

        <section>
          <h3>Eligibility, Terms and Conditions</h3>
          <EligibilityInput />
        </section>
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
} };
