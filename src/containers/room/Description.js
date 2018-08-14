import { IntlProvider, Text } from 'preact-i18n';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import capitalize             from 'lodash/capitalize';
import CroppedContainer       from '~/components/room/CroppedContainer';
import * as actions           from '~/actions';
import style                  from './style.css';


const _ = { capitalize };

function Description({ lang, room, apartment }) {
  return (
    <IntlProvider definition={definition[lang]}>
      <section>
        <h3 className={style.heading}>
          <Text id="title">Description</Text>
        </h3>
        <ul className={'grid-4 has-gutter ' + style.descriptionItems}>
          <li>
            <i className="icon-24 picto-description_surface" />
            <span>
              {apartment.floorArea}m²
              (<Text id="apartment">apartment</Text>)
            </span>
          </li>
          <ElevatorDetail {...{ lang, apartment }} />
          <BedDetail {...{ lang, room }} />
          <li>
            <i className="icon-24 picto-description_surface" />
            <span>{room.floorArea}m² (<Text id="room">room</Text>)</span>
          </li>
          <li class="two-thirds">
            <i className="icon-24 picto-picto_adresse" />
            <a href="#map">
              {apartment.addressStreet} {apartment.addressZip}{' '}
              {_.capitalize(apartment.addressCity)},{' '}
              {_.capitalize(apartment.addressCountry)}{' '}
            </a>
          </li>
        </ul>

        <CroppedContainer height={40}>
          {room[`description${_.capitalize(lang.split('-')[0])}`]}
          <br />
          {apartment[`description${_.capitalize(lang.split('-')[0])}`]}
        </CroppedContainer>
      </section>
    </IntlProvider>
  );
}

// TODO: this should be refactored with getBedDetails
// in ~/components/search/room
function BedDetail({ lang, room }) {
  return (
    <li>
      <i className={`icon-24 ${bedDetails[room.beds].css}`} />
      <span>{bedDetails[room.beds][lang]}</span>
    </li>
  );
}

function ElevatorDetail({ lang, apartment }) {
  return (
    <li>
      <i className="icon-24 picto-elevator" />
      { apartment.floor === 0 ? (
        <Text id="groundFloor">ground floor</Text>
      ) : (
        <span>
          <Text id="floor">floor</Text>{' '}
          {apartment.floor + (lang === 'en-US' ? 1 : 0)}{' '}
          {apartment.elevator ?
            <Text id="with">with</Text> :
            <Text id="without">without</Text>
          }{' '}
          <Text id="elevator">elevator</Text>
        </span>
      )}
    </li>
  );
}

const definition = { 'fr-FR': {
  title: 'Description',
  apartment: 'logement',
  groundFloor: 'rez-de-chaussée',
  floor: 'étage',
  elevator: 'ascenseur',
  room: 'chambre',
} };

const bedDetails = {
  double: { 'fr-FR': '1 lit double', 'en-US': '1 double bed', css: 'picto-equipement_chambre_lit_double' },
  simple: { 'fr-FR': '1 lit simple', 'en-US': '1 simple bed', css: 'picto-equipement_chambre_lit_double' },
  sofa: { 'fr-FR': '1 canapé-lit', 'en-US': '1 sofa bed', css: 'picto-equipement_chambre_canape_ou_canape_lit' },
  'double+sofa': { 'fr-FR': '1 lit double et un canapé-lit', 'en-US': '1 double bed and a sofa bed', css: 'picto-equipement_chambre_lit_double' },
  'simple+sofa': { 'fr-FR': '1 lit simple et un canapé-lit', 'en-US': '1 simple bed and a sofa bed', css: 'picto-equipement_chambre_lit_double'  },
  'simple+simple': { 'fr-FR': '2 lits simple', 'en-US': '2 simple beds', css: 'picto-equipement_chambre_lit_double' },
};

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];

  return {
    lang,
    room,
    apartment,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Description);
