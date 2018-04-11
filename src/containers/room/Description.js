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
          <ElevatorDetail apartment={apartment} />
          <BedDetail room={room} lang={lang} />
          <li>
            <i className="icon-24 picto-description_surface" />
            <span>{room.floorArea}m² (<Text id="room">room</Text>)</span>
          </li>
          <li class="two-thirds">
            <i className="icon-24 picto-picto_adresse" />
            <span>
              {apartment.addressStreet} {apartment.addressZip}
              {_.capitalize(apartment.addressCity)},
              {_.capitalize(apartment.addressCountry)}
            </span>
            <div className={style.shortcut}>
              <a href="#map"><Text id="seeMap">Voir le plan</Text></a>
            </div>
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

function BedDetail({ lang, room }) {
  return (
    <li>
      <i className={`icon-24 ${bedDetails[room.beds].css}`} />
      <span>{bedDetails[room.beds][lang]}
      </span>
    </li>
  );
}

function ElevatorDetail({ apartment }) {
  return (
    <li>
      <i className="icon-24 picto-elevator" />
      <span>
        {apartment.floor}{' '}
        <Text id="floor">floor</Text>{' '}
        {apartment.elevator ?
          <Text id="with">with</Text> :
          <Text id="without">without</Text>
        }
        <Text id="elevator">elevator</Text>
      </span>
    </li>
  );
}

const definition = { 'fr-FR': {
  title: 'Description',
  apartment: 'logement',
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
