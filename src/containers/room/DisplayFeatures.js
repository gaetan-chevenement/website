import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import values                 from 'lodash/values';
import mapValues              from 'lodash/mapValues';
import * as actions           from '~/actions';

const _ = { capitalize, values, mapValues };
class DisplayFeatures extends PureComponent {
  renderFeatures(category, _taxonomy, allFeatures) {
    const features = allFeatures.filter(({ taxonomy }) => taxonomy === _taxonomy);

    if ( features.length === 0 ) {
      return '';
    }

    return (
      <section>
        <h5>
          <Text id={category}>{_.capitalize(category)}</Text>
        </h5>
        <ul class="grid-4 has-gutter-l">
          {features.map(({ name }) => (<li>{name}</li>))}
        </ul>
      </section>
    );
  }

  render() {
    const {
      lang,
      roomFeatures,
      apartmentFeatures,
    } = this.props;

    if ( !roomFeatures || !apartmentFeatures ) {
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
          {['sleep', 'dress', 'work', 'general'].map((taxonomy) => this.renderFeatures(
            taxonomy, `room-features-${taxonomy}`, roomFeatures
          ))}
          <h4><Text id="apartment">Apartment</Text></h4>
          {['kitchen', 'bathroom', 'general'].map((taxonomy) => this.renderFeatures(
            taxonomy, `apartment-features-${taxonomy}`, apartmentFeatures
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
    roomFeatures: room && room.Terms,
    apartmentFeatures: apartment && apartment.Terms,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayFeatures);
