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
const classes = {
  common: 'icon-32',
  unavailable: 'picto-picto_disponibilite_indisponible',
  availableFrom: 'picto-picto_disponibilite_attention',
  availableNow: 'picto-picto_disponibilite_ok',
};

function RoomContent({ lang, roomId, apartmentId, room, apartment, viewsCount }) {
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
                    <a href="#pictures"><Text id="pics">Photos</Text></a>
                  </li>
                  <li>
                    <a href="#description"><Text id="desc">Description</Text></a>
                  </li>
                  <li>
                    <a href="#features"><Text id="features">Equipment</Text></a>
                  </li>
                  <li>
                    <a href="#housemates"><Text id="housemates">Housemates</Text></a>
                  </li>
                  <li>
                    <a href="#map"><Text id="map">Map</Text></a>
                  </li>
                  <li>
                    <a href="#neighborhood"><Text id="neighborhood">Neighbourhood</Text></a>
                  </li>
                </ul>
              </div>
              <a id="pictures" className={style.roomAnchor} />
              <Pictures roomId={roomId} apartmentId={apartmentId} />
              <a id="description" className={style.roomAnchor} />
              <Description roomId={roomId} apartmentId={apartmentId} />
              <a id="features" className={style.roomAnchor} />
              <Features roomId={roomId} apartmentId={apartmentId} />
              <a id="housemates" className={style.roomAnchor} />
              <Housemates apartmentId={apartmentId} />
              <a id="neighborhood" className={style.roomAnchor} />
              <ApartmentDescription />
            </div>
            <div>
              <div className={style.rightHeader}>
                <Availability availableAt={room.availableAt} classes={classes} />
              </div>
              <BookingInfo roomId={roomId} apartmentId={apartmentId} />
              <div className={style.sameRoomCount}>
                <Text id="viewsCount" fields={{ viewsCount }}>
                  {viewsCount} visitors viewed this room this week.
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
  pics: 'Photos',
  desc: 'Description',
  features: 'Equipements', 
  housemates: 'Colocataires',
  map: 'Carte', 
  neighborhood: 'Quartier',
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
