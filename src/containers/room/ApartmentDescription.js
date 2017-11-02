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
    const { apartment: { Features } } = this.props;
    const transportFeature = Features.filter((feature) => /transport/.test(feature.taxonomy));
    const subway = [];
    const tramway = [];
    const bus = [];
    const rer = [];
    const transilien = [];
    const nearbyBike = [];

    transportFeature.map((feature) => {
      if ( /subway/.test(feature.taxonomy) ){
        subway.push(feature);
      }
      if ( /tramway/.test(feature.taxonomy) ){
        tramway.push(feature);
      }
      if ( /bus/.test(feature.taxonomy) ){
        bus.push(feature);
      }
      if ( /rer/.test(feature.taxonomy) ){
        rer.push(feature);
      }
      if ( /transilien/.test(feature.taxonomy) ){
        transilien.push(feature);
      }
      if ( /nearbyBike/.test(feature.taxonomy) ){
        nearbyBike.push(feature);
      }
    });
    return (
      <section>
        {subway.length > 0 ?
          <div>
            <h6>Subway</h6>
            <ul class="grid-3">
              {subway.map((feat) => (
                <div>{feat.name}</div>
              ))}
            </ul>
          </div>
          : ''}
        {tramway.length > 0 ?
          <div>
            <h6>Tramway</h6>
            <ul class="grid-3">
              {tramway.map((feat) => (
                <div>{feat.name}</div>
              ))}
            </ul>
          </div>
          :''}
        {bus.length > 0 ?
          <div>
            <h6>Bus</h6>
            <ul class="grid-3">
              {bus.map((feat) => (
                <div>{feat.name}</div>
              ))}
            </ul>
          </div>
          :''}
        {rer.length > 0 ?
          <div>
            <h6>Rer</h6>
            <ul class="grid-3">
              {rer.map((feat) => (
                <div>{feat.name}</div>
              ))}
            </ul>
          </div>
          :''}
        {transilien.length > 0 ?
          <div>
            <h6>Transilien</h6>
            <ul class="grid-3">
              {transilien.map((feat) => (
                <div>{feat.name}</div>
              ))}
            </ul>
          </div>
          :''}
        {nearbyBike.length > 0 ?
          <div>
            <h6>NearbyBike</h6>
            <ul class="grid-3">
              {nearbyBike.map((feat) => (
                <div>{feat.name}</div>
              ))}
            </ul>
          </div>
          :''}
      </section>
    );
  }

  render() {
    const {
      lang,
      apartment,
      District,
      getFeatures,
    } = this.props;

    if (!apartment || !getFeatures || !District) {
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
              </div>
            </ul>
          </section>
        </section>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
} };

function mapStateToProps({ route: { lang }, apartments }, { apartmentId }) {
  const apartment = apartments[apartmentId];

  return {
    lang,
    apartment,
    getFeatures: apartment && apartment.Features && apartment.Features.length > 0,
    District: apartment && apartment.District,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pictures);
