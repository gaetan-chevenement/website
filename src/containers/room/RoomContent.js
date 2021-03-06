import random                 from 'lodash/random';
import { Component }          from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider, Text } from 'preact-i18n';
import Features               from '~/containers/room/Features';
import Pictures               from '~/containers/room/Pictures';
import Housemates             from '~/containers/room/Housemates';
import Description            from '~/containers/room/Description';
import ApartmentDescription   from '~/containers/room/ApartmentDescription';
import BookingInfo            from '~/containers/room/BookingInfo';
import SingleMap              from '~/containers/room/Map';
import Availability           from '~/components/Availability';
import RoomServices           from '~/components/room/RoomServices';
import Questions              from '~/components/room/Questions';
import Guide                  from '~/components/room/Guide';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import style                  from './style.css';
const _ = { random };

class RoomContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      libSpyScroll: null,
    };

    if ( typeof window === 'object' ) {
      import('react-spy-scroll')
        .then(spyScroll => {
          this.setState({ libSpyScroll: spyScroll });

          return true;
        })
        .catch(() => console.error('leaflet loading failed'));
    }
  }

  render({ lang, roomId, apartmentId, room, apartment, viewsCount }) {
    const { availableAt } = room;
    let AnchorLink = 'a';
    let AnchorElement = 'div';

    if ( this.state.libSpyScroll ) {
      AnchorElement = this.state.libSpyScroll.AnchorElement;
      AnchorLink = this.state.libSpyScroll.AnchorLink;
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div className={style.roomPage}>
          <div className={`${style.roomContent} content content-wide`}>
            <div className={style.mainColumns}>
              <div>
                <div className={[style.leftHeader]}>
                  {room.name}
                </div>
                <div className={style.links} id="room-anchors">
                  <ul>
                    <li>
                      <AnchorLink href="overview"><Text id="overview">Overview</Text></AnchorLink>
                    </li>
                    <li>
                      <AnchorLink href="housemates"><Text id="housemates">Housemates</Text></AnchorLink>
                    </li>
                    <li>
                      <AnchorLink href="location"><Text id="location">Location</Text></AnchorLink>
                    </li>
                  </ul>
                </div>
                <AnchorElement id="overview" className={style.roomAnchor}>
                  <div>
                    <Pictures roomId={roomId} apartmentId={apartmentId} />
                    <Description roomId={roomId} apartmentId={apartmentId} />
                    <Features roomId={roomId} apartmentId={apartmentId} />
                  </div>
                </AnchorElement>
                <AnchorElement id="housemates" className={style.roomAnchor}>
                  <Housemates apartmentId={apartmentId} />
                </AnchorElement>
                <AnchorElement id="location" className={style.roomAnchor}>
                  <ApartmentDescription />
                </AnchorElement>
              </div>
              <div>
                <div className={style.rightHeader}>
                  <Availability
                    {...{ lang, availableAt }}
                  />
                </div>
                <BookingInfo roomId={roomId} apartmentId={apartmentId} />
                <div className={style.sameRoomCount}>
                  <Text id="viewsCount" fields={{ viewsCount }}>
                    {`${viewsCount} visitors viewed this room this week.`}
                  </Text>
                </div>
              </div>
            </div>
          </div>
          <a id="map" className={style.roomAnchor} />
          { typeof window !== 'object' ? null :
            <SingleMap apartment={apartment} />
          }

          <RoomServices />
          <Questions />
          <Guide />
        </div>
      </IntlProvider>
    );
  }
}

const definition = {
  'fr-FR': {
    overview: 'Aperçu',
    housemates: 'Colocataires',
    location: 'Localisation',
    viewsCount: '{{viewsCount}} personnes ont consulté cette annonce cette semaine.',
  },
  'es-ES': {
    overview: 'Panorama general',
    housemates: 'Compañeros de cuarto',
    location: 'Localización',
    viewsCount: '{{viewsCount}} personas vieron este anuncio esta semana.',
  },
};

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];

  return {
    lang,
    room: { ...room, name: Utils.localizeRoomName(room.name, lang) },
    apartment,
    viewsCount: _.random(350, 550),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomContent);
