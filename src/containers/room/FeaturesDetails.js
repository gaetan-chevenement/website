import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider }       from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import values                 from 'lodash/values';
import mapValues              from 'lodash/mapValues';
import Promise                from 'bluebird';
import autobind               from 'autobind-decorator';
import Features                  from '~/components/Features/features';
import * as actions           from '~/actions';

const _ = { capitalize, values, mapValues };
class FeaturesDetails extends PureComponent {
  @autobind
  handleFormSubmit(event) {
    const { actions } = this.props;

    event.preventDefault();
    Promise.resolve()
      .then(() => actions.saveFeatures(this.props))
      .catch((e) => console.error(e));
  }

  @autobind
  handleFeatureChange(event) {
    let feature = {};
    ['name', 'taxonomy', 'termable']
      .forEach((attribute) => Object.assign(
        feature,
        { [attribute]: event.target.getAttribute(attribute) }
      ));
    Object.assign(
      feature,
      { termableId: feature.termable === 'Room' ?
        this.props.roomId :
        this.props.apartmentId,
      });

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
    return (
      admin ?
        <li>
          <input type="checkbox" name={name} taxonomy={taxonomy}
            termable={termable} label={label}
            onChange={this.handleFeatureChange}
            checked={isChecked}
          /> {label}</li>
        : isChecked ?
          <li>{label}</li> :
          ''
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
          {displayTitle ? <h4>{_.capitalize(taxonomy.split('-')[2])}</h4> : ''}
          <ul>{featuresList.map((term) => this.renderTerm(term))}</ul>
        </section>
        : '');
  }

  render() {
    const {
      lang,
      roomError,
      roomId,
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
            <form onSubmit={this.handleFormSubmit}>
              <h3>Room</h3>
              {['room-features-sleep',
                'room-features-dress',
                'room-features-work',
                'room-features-general'].map((taxonomy) => this.renderFeatures(taxonomy, 'Room'))
              }
              <h3>Apartment</h3>
              {['apartment-features-kitchen',
                'apartment-features-bathroom',
                'apartment-features-general'].map((taxonomy) => this.renderFeatures(taxonomy, 'Apartment'))
              }
              <input disabled={roomError && roomError.unauthorized} type="submit" />
            </form>
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
            <h3>Room</h3>
            {['room-features-sleep',
              'room-features-dress',
              'room-features-work',
              'room-features-general'].map((taxonomy) => this.renderFeatures(taxonomy, 'Room'))
            }
            <h3>Apartment</h3>
            {['apartment-features-kitchen',
              'apartment-features-bathroom',
              'apartment-features-general'].map((taxonomy) => this.renderFeatures(taxonomy, 'Apartment'))}
          </section>
        }
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {

} };

function mapStateToProps({ route: { lang, admin }, rooms, apartments }, { roomId, apartmentId }) {

  return {
    lang,
    admin,
    roomError: rooms && rooms.errors,
    isFeaturesValidated: rooms && rooms.isValidated,
    RoomFeatures: rooms[roomId] && rooms[roomId].Features,
    ApartmentFeatures: apartments[apartmentId] && apartments[apartmentId].Features,
    isApartmentFeaturesInitialized: apartments[apartmentId] && apartments[apartmentId].Features && apartments[apartmentId].Features.length > 0,
    isRoomFeaturesInitialized: rooms[roomId] && rooms[roomId].Features && rooms[roomId].Features.length > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeaturesDetails);
