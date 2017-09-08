import { IntlProvider }       from 'preact-i18n';
import FeatureList						from '~/components/booking/FeatureList';
import PackPicker							from './PackPicker';
import CheckinInputs			    from './CheckinInputs';
import ClientInputs			      from './ClientInputs';
import EligibilityInput		   	from './EligibilityInput';

export default function(route) {
  return (
    <IntlProvider definition={definition[route.lang]}>
      <div>
        <section>
          <ClientInputs {...route} />
        </section>

        <section>
          <h3>Choose Your Housing Pack</h3>
          <PackPicker {...route} />
        </section>

        <section>
          <h3>Detailed comparison</h3>
          <FeatureList {...route} />
        </section>

        <section>
          <h3>Planned date and time of check-in</h3>
          <p>(This can be changed at any time.)</p>
          <CheckinInputs {...route} />
        </section>

        <section>
          <h3>Eligibility, Terms and Conditions</h3>
          <EligibilityInput {...route} />
        </section>
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
} };
