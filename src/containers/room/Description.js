import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import * as actions           from '~/actions';
import CroppedContainer            from '~/components/room/CroppedContainer';
import style from './style.css';


const _ = { capitalize };

class Description extends PureComponent {
  renderBedDetail() {
    const { room, lang } = this.props;

    return (
      <li>
        <i className={'icon-24 ' + bedDetails[room.beds].css} />
        <span>{bedDetails[room.beds][lang]}
        </span>
      </li>
    );
  }

  renderElevatorDetail() {
    const { apartment, lang, roomFeatures } = this.props;

    return (
      <li>
        <i className="icon-24 picto-elevator" />
        <span>
          {apartment.floor}{' '}
          <Text id="floor">floor</Text>{' '}
          {roomFeatures.some(({ name, taxonomy }) => name === 'noElevator') ?
            elevatorDetail.without[lang] : elevatorDetail.with[lang]
          }{' '}
          <Text id="elevator">elevator</Text>
        </span>
      </li>
    );
  }


  render() {
    const {
      lang,
      room,
      roomFeatures,
      apartment,
    } = this.props;

    if ( !room || !apartment || !roomFeatures ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    const fullAddress = <span>{apartment.addressStreet} {apartment.addressZip} {_.capitalize(apartment.addressCity)}, {_.capitalize(apartment.addressCountry)}</span>;
    return (
      <IntlProvider definition={definition[lang]}>
        <section>
          <h3 className={style.heading}><Text id="title">Description</Text></h3>
          <ul className={'grid-4 has-gutter ' + style.descriptionItems}>
            <li>
              <i className="icon-24 picto-description_surface" />
              <span>{apartment.floorArea}m² (<Text id="apartment">apartment</Text>)</span>
            </li>
            {this.renderElevatorDetail()}
            {this.renderBedDetail()}
            <li>
              <i className="icon-24 picto-description_surface" />
              <span>{room.floorArea}m² (<Text id="room">room</Text>)</span>
            </li>
            <li class="two-thirds">
              <i className="icon-24 picto-picto_adresse" />
              <span>{fullAddress}</span>
              <div className={style.shortcut}>
                <a href="#map">Voir le plan</a>
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

const elevatorDetail = {
  with: { 'fr-FR': 'avec', 'en-US': 'with' },
  without: { 'fr-FR': 'sans', 'en-US': 'without' },
};

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];

  return {
    lang,
    room,
    roomFeatures: room && room.Terms,
    apartment,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Description);
