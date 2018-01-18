import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import CroppedContainer       from '~/components/room/CroppedContainer';
import capitalize             from 'lodash/capitalize';
import * as actions           from '~/actions';
import style from './style.css';

const _ = { capitalize };

class ApartmentDescription extends PureComponent {

  renderTransport() {
    const { apartmentFeatures, lang } = this.props;
    const transports = ['subway', 'tramway', 'bus', 'rer', 'transilien', 'nearbyBike']
      .map((name) => ({
        name,
        list: apartmentFeatures.filter(({ taxonomy }) =>
          new RegExp(`transport-${name}`).test(taxonomy)
        ),
      }));

    return (
      <section>
          {transports.map(({ name, list }) => list.length > 0 ?
            <div className={'grid-4'}>
              <h6 className={'one-third'}>{transportName[name][lang]}</h6>
              <ul className={'two-thirds'}>
                {list.map((i) => (
                  <div className={style[`transport-${name}`]}>{i.name}</div>
                ))}
              </ul>
            </div>
            : ''
          )}
      </section>
    );
  }

  render() {
    const {
      lang,
      isLoading,
      apartment,
      district,
      districtFeatures,
    } = this.props;

    if ( isLoading ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    let floorPlan = null;

    if (apartment.floorPlan !== undefined) {
      floorPlan = (
        <section>
          <h3 className={style.heading}><Text id="floorPlan">Floor Plan</Text></h3>
          <img src={apartment.floorPlan} alt="floor plan" />
          <div className={style.planNotice}>
            La surface au sol de chaque chambre inclut ses placards, balcons, loggias,
            salle de bain, WC, espaces sous pentes... avec accès privatif
          </div>
        </section>
      );
    }
    return (
      <IntlProvider definition={definition[lang]}>
        <section>
          {floorPlan}
          <section>
            <h3 className={style.heading}><Text id="district">District</Text></h3>
            <div className={['grid-10 has-gutter-l', style.districtContent].join(' ')}>
              <div className="one-half">
                <CroppedContainer height={150}>
                  <h5>{district.label}</h5>
                  <div>{district[`description${_.capitalize(lang.split('-')[0])}`]}</div>
                </CroppedContainer>
              </div>
              <div className="one-quarter">
                <CroppedContainer height={150}>
                  <h5>Transports</h5>
                  {this.renderTransport()}
                </CroppedContainer>
              </div>
              <div className="one-quarter">
                <CroppedContainer height={150}>
                  <h5><Text id="nearbySchool">Nearby School(s)</Text></h5>
                  <ul className={style.nearbySchools}>
                    {districtFeatures
                      .filter(({ taxonomy }) => taxonomy === 'nearby-school')
                      .map((school) => (<li>{school.name}</li>))
                    }
                  </ul>
                </CroppedContainer>
              </div>
            </div>
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

function mapStateToProps({ route: { lang, roomId }, rooms, apartments, districts }) {
  const apartment = apartments[rooms[roomId].ApartmentId];
  const district = apartment && districts[apartment._DistrictId];

  if (
    !apartment || apartment.isLoading || !apartment.Terms ||
    !district || district.isLoading || !district.Terms
  ) {
    return { isLoading: true };
  }

  return {
    lang,
    apartment,
    district,
    apartmentFeatures: apartment.Terms,
    districtFeatures: district.Terms,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApartmentDescription);
