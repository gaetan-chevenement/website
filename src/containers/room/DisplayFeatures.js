import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import values                 from 'lodash/values';
import mapValues              from 'lodash/mapValues';
import Features               from '~/components/Features/features';
import * as actions           from '~/actions';

const _ = { capitalize, values, mapValues };
class DisplayFeatures extends PureComponent {
  renderTerm({ termable, taxonomy, name, label, isChecked }) {
    return isChecked ? <li>{label}</li> : '';
  }

  renderFeatures(taxonomy, category) {
    const { lang, admin } = this.props;
    const InitializedFeatures = this.props[`${category}Features`];
    const featuresList = _.values(_.mapValues(Features[category][taxonomy],(value, key, object) => Object.assign(
      object[key],
      {
        termable: category,
        taxonomy,
        name: key,
        label: object[key][lang],
        isChecked: InitializedFeatures.some((feature) => feature.name === key && feature.taxonomy === taxonomy),
      })));
    const displayTitle = admin ? true : !!featuresList.some((feature) => feature.isChecked !== false);

    return (
      featuresList.length > 0 ?
        <section>
          {displayTitle ? <div><h5><Text id={taxonomy.split('-')[2]}>{_.capitalize(taxonomy.split('-')[2])}</Text></h5><br /></div> : ''}
          <ul class="grid-4 has-gutter-l">{featuresList.map((term) => this.renderTerm(term))}</ul>
        </section>
        : ''
    );
  }

  render() {
    const {
      lang,
      isApartmentFeaturesInitialized,
      isRoomFeaturesInitialized,
    } = this.props;

    if ( isRoomFeaturesInitialized === undefined && isApartmentFeaturesInitialized === undefined) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <section>
          <h3><Text id="title">Features</Text></h3>
          <br />
          <h4><Text id="room">Room</Text></h4>
          {['sleep', 'dress', 'work', 'general'].map((taxonomy) => (
            this.renderFeatures(`room-features-${taxonomy}`, 'Room')
          ))}
          <h4><Text id="apartment">Apartment</Text></h4>
          {['kitchen', 'bathroom', 'general'].map((taxonomy) => (
            this.renderFeatures(`apartment-features-${taxonomy}`, 'Apartment')
          ))}
        </section>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  title: 'Equipements',
  room: 'Chambre',
  apartment: 'Appartement',
  sleep: 'Dormir',
  dress: 'S\'habiller',
  work: 'Travailler',
  general: 'Général',
  kitchen: 'Cuisine',
  bathroom: 'Salle de Bain',
} };

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];
  return {
    lang,
    room,
    apartment,
    RoomFeatures: room && room.Features,
    RoomPictures: room && room.Pictures,
    ApartmentPictures: apartment && apartment.Pictures,
    ApartmentFeatures: apartment && apartment.Features,
    isApartmentFeaturesInitialized: apartment && apartment.Features && apartment.Features.length > 0,
    isRoomFeaturesInitialized: room && room.Features && room.Features.length > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayFeatures);


