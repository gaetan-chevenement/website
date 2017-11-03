import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import * as actions           from '~/actions';

const _ = { capitalize };

class Pictures extends PureComponent {

  renderTransport() {
    const { apartment: { Features }, lang } = this.props;
    const transports = [];

    ['subway', 'tramway', 'bus', 'rer', 'transilien', 'nearbyBike']
      .map((transport) => {
        transports[transport] = Features.filter((feature) =>
          new RegExp(`transport-${transport}`).test(feature.taxonomy)
        );
      });

    return (
      <section>
        {Object.keys(transports).map((key, index) => {
          if ( transports[key].length > 0 ) {
            return (
              <div>
                <h6>{transportName[key][lang]}</h6>
                <ul class="grid-3">
                  {transports[key].map((feat) => (
                    <div>{feat.name}</div>
                  ))}
                </ul>
              </div>
            );
          }
        })
        }
      </section>
    );
  }

  render() {
    const {
      lang,
      apartment,
      District,
      NearbySchools,
      getFeatures,
    } = this.props;

    if (!apartment || !getFeatures || !District || !NearbySchools) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <section>
          <section>
            <h3><Text id="floorPlan">Floor Plan</Text></h3>
            <img src={apartment.floorPlan} alt="floorPlan" />
          </section>
          <section>
            <h3><Text id="district">Disctrict</Text></h3>
            <ul class="grid-3 has-gutter-l">
              <div class="three-fifth">
                <h5>{District.label}</h5>
                <div>{District[`description${_.capitalize(lang.split('-')[0])}`]}</div>
              </div>
              <div>
                <h5>Transports</h5>
                {this.renderTransport()}
              </div>
              <div>
                <h5><Text id="nearbySchool">Nearby School(s)</Text></h5>
                {NearbySchools.map((school) =>
                  <li>{school.name}</li>
                )}
              </div>
            </ul>
          </section>
        </section>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  nearbySchool: 'Ecole(s) à proximité',
  floorPlan: 'Plan du logement',
  district: 'Quartier',
} };

const transportName = {
  subway: { 'fr-FR': 'Métro', 'en-US': 'Subway' },
  tramway: { 'fr-FR': 'Tramway', 'en-US': 'Tramway' },
  bus: { 'fr-FR': 'Bus', 'en-US': 'Bus' },
  rer: { 'fr-FR': 'Rer', 'en-US': 'Rer' },
  transilien: { 'fr-FR': 'Transilien', 'en-US': 'Transilien' },
  nearbyBike: { 'fr-FR': 'Vélos', 'en-US': 'Bikes' },
};

function mapStateToProps({ route: { lang }, apartments }, { apartmentId }) {
  const apartment = apartments[apartmentId];

  return {
    lang,
    apartment,
    getFeatures: apartment && apartment.Features && apartment.Features.length > 0,
    District: apartment && apartment.District,
    NearbySchools: apartment && apartment.NearbySchools,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pictures);
