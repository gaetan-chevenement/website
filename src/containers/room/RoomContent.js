import random                 from 'lodash/random';
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
import * as actions           from '~/actions';
import style                  from './style.css';

const _ = { random };

function RoomContent({ lang, roomId, apartmentId, room, apartment, viewsCount }) {
  const { availableAt } = room;

  return (
    <IntlProvider definition={definition[lang]}>
      <div className={style.roomPage}>
        <div className={`${style.roomContent} content content-wide`}>
          <div className={style.mainColumns}>
            <div>
              <div className={[style.leftHeader]}>
                {room.name}
              </div>
              <div className={style.links}>
                <ul>
                  <li>
                    <a href="#overview"><Text id="overview">Overview</Text></a>
                  </li>
                  <li>
                    <a href="#housemates"><Text id="housemates">Housemates</Text></a>
                  </li>
                  <li>
                    <a href="#location"><Text id="location">Location</Text></a>
                  </li>
                </ul>
              </div>
              <a id="overview" className={style.roomAnchor} />
              <Pictures roomId={roomId} apartmentId={apartmentId} />
              <a id="description" className={style.roomAnchor} />
              <Description roomId={roomId} apartmentId={apartmentId} />
              <a id="features" className={style.roomAnchor} />
              <Features roomId={roomId} apartmentId={apartmentId} />
              <a id="housemates" className={style.roomAnchor} />
              <Housemates apartmentId={apartmentId} />
              <a id="location" className={style.roomAnchor} />
              <ApartmentDescription />
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
        <SingleMap apartment={apartment} />
        <RoomServices />
        <Questions />
        <Guide />
      </div>
    </IntlProvider>
  );
}

const definition = { 'fr-FR': {
  overview: 'Aperçu',
  housemates: 'Colocataires',
  location: 'Localisation',
  viewsCount: '{{viewsCount}} personnes ont consulté cette annonce cette semaine.',
} };

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];

  return {
    lang,
    room,
    apartment,
    viewsCount: _.random(350, 550),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomContent);
