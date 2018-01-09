import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import values                 from 'lodash/values';
import mapValues              from 'lodash/mapValues';
import * as actions           from '~/actions';

import style from './style.css';


const _ = { capitalize, values, mapValues };
class DisplayFeatures extends PureComponent {
  renderFeatures(category, _taxonomy, allFeatures) {
    const features = allFeatures.filter(({ taxonomy }) => taxonomy === _taxonomy);

    if ( features.length === 0 ) {
      return '';
    }

    return (
      <section className={style.featuresColumn}>
        <h5 className={style.featuresRoom}>
          <Text id={category}>{_.capitalize(category)}</Text>
        </h5>
        <ul>
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
          <h3 className={style.heading}><Text id="title">Features</Text></h3>
          <br />
          <h4 className={style.subtitle}>
            <span>
              <Text id="room" >Room</Text>
            </span>
          </h4>
          <div className={style.featuresContent}>
            {['sleep', 'dress', 'work', 'general'].map((taxonomy) => this.renderFeatures(
              taxonomy, `room-features-${taxonomy}`, roomFeatures
            ))}
          </div>
          <h4 className={style.subtitle}>
            <span>
              <Text id="apartment">Apartment</Text>
            </span>
          </h4>
          <div className={style.featuresContent}>
            {['kitchen', 'bathroom', 'general'].map((taxonomy) => this.renderFeatures(
              taxonomy, `apartment-features-${taxonomy}`, apartmentFeatures
            ))}
          </div>
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
