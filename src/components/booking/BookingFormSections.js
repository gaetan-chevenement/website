import { IntlProvider, Text } from 'preact-i18n';
import Utils                  from '~/utils';
import FeatureList						from '~/components/booking/FeatureList';
import PackPicker							from '~/containers/booking/PackPicker';
import ClientInputs			      from '~/containers/booking/ClientInputs';

function BookingFormSections({ lang }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <div>
        <section>
          <h3><Text id="housingPack">Choose Your Housing Pack</Text></h3>
          <PackPicker />
        </section>

        <section>
          <h3><Text id="detail">Detailed comparison</Text></h3>
          <FeatureList isPriceHidden />
        </section>

        <section>
          <h3><Text id="personal">Personal info</Text></h3>
          <ClientInputs />
        </section>
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  housingPack: 'Choisissez Votre Pack Logement',
  detail: 'Comparaison Détaillée',
  personal: 'Infos personnelles',
} };

export default Utils.connectLang(BookingFormSections);
