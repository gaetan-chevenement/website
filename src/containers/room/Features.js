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
          {['sleep', 'dress', 'work', 'general'].map((group) => (
            <FeaturesList
              lang={lang}
              group={group}
              features={roomFeatures[group]}
              featureDetails={ENUMS[`room-features-${group}`]}
            />
          ))}
        </div>
        <h4 className={style.subtitle}>
          <span>
            <Text id="apartment">Apartment</Text>
          </span>
        </h4>
        <div className={style.featuresContent}>
          {['kitchen', 'bathroom', 'general'].map((group) => (
            <FeaturesList
              lang={lang}
              group={group}
              features={apartmentFeatures[group]}
              featureDetails={ENUMS[`apartment-features-${group}`]}
            />
          ))}
        </div>
      </section>
    </IntlProvider>
  );
}

function FeaturesList({ lang, group, taxonomy, features = [], featureDetails }) {
  return features.length > 0 && (
    <section className={style.featuresColumn}>
      <div className={style.featuresRoom}>
        <Text id={group}>{_.capitalize(group)}</Text>
      </div>
      <CroppedContainer height={170}>
        <ul>{features.map((name) => (
          <Feature
            label={featureDetails[name][lang]}
            className={featureDetails[name].css}
          />
        ))}</ul>
      </CroppedContainer>
    </section>
  );
}

function Feature({ label, className }) {
  return (
    <li>
      <i className={`icon-24 ${className}`} />
      <span>{label}</span>
    </li>
  );
}

const definition = {
  'fr-FR': {
    title: 'Équipements',
    room: 'Chambre',
    apartment: 'Appartement',
    sleep: 'Dormir',
    dress: 'S\'habiller',
    work: 'Travailler',
    general: 'Général',
    kitchen: 'Cuisine',
    bathroom: 'Salle de Bain',
  },
  'es-ES': {
    title: 'Equipo',
    room: 'Habitación',
    apartment: 'Apartamento',
    sleep: 'Dormir',
    dress: 'Vestirse',
    work: 'Trabajo',
    general: 'General',
    kitchen: 'Cocina',
    bathroom: 'Baño',
  },
};

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
