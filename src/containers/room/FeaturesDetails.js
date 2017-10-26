import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { Checkbox }           from 'react-toolbox/lib/checkbox';
import { Button }             from 'react-toolbox/lib/button';
import { IntlProvider, Text } from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import values                 from 'lodash/values';
import mapValues              from 'lodash/mapValues';
import Promise                from 'bluebird';
import autobind               from 'autobind-decorator';
import ApartmentDetails       from '~/containers/room/ApartmentDetails';
import RoomDetails            from '~/containers/room/RoomDetails';
import Features               from '~/components/Features/features';
import * as actions           from '~/actions';

const _ = { capitalize, values, mapValues };
class FeaturesDetails extends PureComponent {
  @autobind
  saveChange(event, value) {
    const { actions, room, apartment } = this.props;

    Promise.resolve()
      .then(() => Promise.all([
        actions.validateRoom(room),
        actions.validateApartment(apartment),
      ]))
      .then(() => actions.saveRoomAndApartment(this.props))
      .then(() => actions.savePictures(this.props))
      .then(() => actions.saveFeatures(this.props))
      .catch((e) => console.error(e));
  }

  @autobind
  handleFeatureChange(value, event) {
    let feature = {};

    ['name', 'taxonomy', 'termable']
      .forEach((attribute) =>
        feature[attribute] = event.target.getAttribute(attribute)
      );
    feature.TermableId = feature.termable === 'Room' ?
      this.props.roomId :
      this.props.apartmentId;

    event.target.checked ?
      feature.termable === 'Room' ?
        this.props.actions.addRoomFeature(feature) :
        this.props.actions.addApartmentFeature(feature) :
      feature.termable === 'Room' ?
        this.props.actions.deleteRoomFeature(feature) :
        this.props.actions.deleteApartmentFeature(feature);
  }

  renderTerm({ termable, taxonomy, name, label, isChecked }) {
    const { admin } = this.props;
    if ( !admin ) {
      return isChecked ? <li>{label}</li> : '';
    }
    return (
      <Checkbox
        checked={isChecked}
        label={label}
        onChange={this.handleFeatureChange}
        name={name}
        taxonomy={taxonomy}
        termable={termable}
      />
    );
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
          {displayTitle ? <div><h4><Text id={taxonomy.split('-')[2]}>{_.capitalize(taxonomy.split('-')[2])}</Text></h4><br /></div> : ''}
          <ul class="grid-4 has-gutter-l">{featuresList.map((term) => this.renderTerm(term))}</ul>
        </section>
        : ''
    );
  }

  render() {
    const {
      lang,
      roomError,
      roomId,
      apartmentId,
      isFeaturesValidated,
      isApartmentFeaturesInitialized,
      isRoomFeaturesInitialized,
      admin,
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
        { admin ?
          <section>
            <RoomDetails roomId={roomId} />
            <h3 class="text-center">Features</h3>
            <br />
            {['sleep', 'dress', 'work', 'general'].map((taxonomy) => (
              this.renderFeatures(`room-features-${taxonomy}`, 'Room')
            ))}
            <ApartmentDetails roomId={roomId} apartmentId={apartmentId} />
            <h3 class="text-center">Features</h3>
            <br />
            {['kitchen', 'bathroom', 'general'].map((taxonomy) => (
              this.renderFeatures(`apartment-features-${taxonomy}`, 'Apartment')
            ))}
            <div class="text-center">
              <Button
                icon="add"
                label={<Text id="save">Save Changes</Text>}
                raised
                primary
                onClick={this.saveChange}
              />
            </div>
            {roomError && roomError.unauthorized ?
              <div>
                <span>{roomError.unauthorized}<br />
                  <a href="/admin">Login</a> <br />
                  Or <br />
                  <a href={`/${lang}/room/${roomId}`}>Go back</a>
                </span>

              </div>
              : ''
            }
            {isFeaturesValidated ?
              <div>
                <span>Features have been successfully updated on the backoffice</span>
              </div>
              : ''
            }
          </section> :
          <section>
            <h3 class="text-center"><Text id="room">Room</Text></h3>
            {['sleep', 'dress', 'work', 'general'].map((taxonomy) => (
              this.renderFeatures(`room-features-${taxonomy}`, 'Room')
            ))}
            <h3 class="text-center"><Text id="apartment">Apartment</Text></h3>
            {['kitchen', 'bathroom', 'general'].map((taxonomy) => (
              this.renderFeatures(taxonomy, 'Apartment')
            ))}
          </section>
        }
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  room: 'Chambre',
  apartment: 'Appartement',
  save: 'Enregistrer les modifications',
  sleep: 'Dormir',
  dress: 'S\'habiller',
  work: 'Travailler',
  general: 'Général',
  kitchen: 'Cuisine',
  bathroom: 'Salle de Bain',
} };

function mapStateToProps({ route: { lang, admin }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];
  return {
    lang,
    admin,
    room,
    apartment,
    roomError: room && room.errors,
    isFeaturesValidated: rooms && rooms.isValidated,
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

export default connect(mapStateToProps, mapDispatchToProps)(FeaturesDetails);
