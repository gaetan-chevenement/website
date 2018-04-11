import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider, Text } from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import values                 from 'lodash/values';
import mapValues              from 'lodash/mapValues';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import _const                 from '~/const';
import CroppedContainer       from '~/components/room/CroppedContainer';
import style from './style.css';

const _ = { capitalize, values, mapValues };
const { ENUMS } = _const;

function Features({ lang, roomFeatures, apartmentFeatures }) {
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
          {['sleep', 'dress', 'work', 'general'].map((taxonomy) => (
            <FeaturesList
              category={taxonomy}
              _taxonomy={`room-features-${taxonomy}`}
              features={roomFeatures[taxonomy]}
              featureDetails={ENUMS[`room-features-${taxonomy}`]}
            />
          ))}
        </div>
        <h4 className={style.subtitle}>
          <span>
            <Text id="apartment">Apartment</Text>
          </span>
        </h4>
        <div className={style.featuresContent}>
          {['kitchen', 'bathroom', 'general'].map((taxonomy) => (
            <FeaturesList
              category={taxonomy}
              _taxonomy={`apartment-features-${taxonomy}`}
              features={apartmentFeatures[taxonomy]}
              featureDetails={ENUMS[`apartment-features-${taxonomy}`]}
            />
          ))}
        </div>
      </section>
    </IntlProvider>
  );
}

function FeaturesList({ category, _taxonomy, features = [], featureDetails }) {
  return features.length > 0 && (
    <section className={style.featuresColumn}>
      <div className={style.featuresRoom}>
        <Text id={category}>{_.capitalize(category)}</Text>
      </div>
      <CroppedContainer height={170}>
        <ul>
          {features.map(({ name, detail }) => (
            <Feature name={name} detail={detail} />
          ))}
        </ul>
      </CroppedContainer>
    </section>
  );
}

function Feature({ name, detail }) {
  if ( detail === undefined) {
    return (<li>{name}</li>);
  }
  return (
    <li>
      <i className={`icon-24 ${detail.css}`} />
      <span>{detail}</span>
    </li>
  );
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
    roomFeatures: room && Utils.getFeatures(room),
    apartmentFeatures: apartment && Utils.getFeatures(apartment),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Features);
