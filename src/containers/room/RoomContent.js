import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider } from 'preact-i18n';
import DisplayFeatures        from '~/containers/room/DisplayFeatures';
import Pictures               from '~/containers/room/Pictures';
import HouseMates             from '~/containers/room/HouseMates';
import Description            from '~/containers/room/Description';
import ApartmentDescription   from '~/containers/room/ApartmentDescription';
import BookingInfo            from '~/containers/room/BookingInfo';
import SingleMap              from '~/containers/room/Map';
import RoomServices           from '~/containers/room/RoomServices';
import Questions              from '~/containers/room/Questions';
import Guide                  from '~/containers/room/Guide';
import * as actions           from '~/actions';

import style from './style.css';

class RoomContent extends PureComponent {
  render() {
    const { lang, roomId, apartmentId, roomName, apartment } = this.props;
    console.log(this.props.room)
    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <div className={['content', 'content-wide', style.roomContent].join(' ')}>
            <div className="grid-10 has-gutter">
              <div className="two-thirds">
                <div className={[style.leftHeader]}>
                  {roomName}
                </div>
                <div className={style.links}>
                  <ul>
                    <li>
                      <a href="#pictures">Photos</a>
                    </li>
                    <li>
                      <a href="#description">Description</a>
                    </li>
                    <li>
                      <a href="#features">Equipements</a>
                    </li>
                    <li>
                      <a href="#housemates">Colocataires</a>
                    </li>
                    <li>
                      <a href="#map">Plan</a>
                    </li>
                    <li>
                      <a href="#district">Quartier</a>
                    </li>
                  </ul>
                </div>
                <a id="pictures" className={style.roomAnchor} />
                <Pictures roomId={roomId} apartmentId={apartmentId} />
                <a id="description" className={style.roomAnchor} />
                <Description roomId={roomId} apartmentId={apartmentId} />
                <a id="features" className={style.roomAnchor} />
                <DisplayFeatures roomId={roomId} apartmentId={apartmentId} />
                <a id="housemates" className={style.roomAnchor} />
                <HouseMates apartmentId={apartmentId} roomId={roomId} />
                <a id="district" className={style.roomAnchor} />
                <ApartmentDescription />
              </div>
              <div className="one-third">
                <div className={style.rightHeader}>
                  Disponible immédiatement
                </div>
                <BookingInfo roomId={roomId} apartmentId={apartmentId} />
                <div className={style.sameRoomCount}>
                  423 autres personnes ont consulté cette annonce au cours
                  des 7 derniers jours. Nous vous recommandons de réserver
                  sans tarder.
                </div>
              </div>
            </div>
          </div>
          <SingleMap apartment={apartment} />
          <RoomServices />
          <Questions />
          <Guide />
        </div>

      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {} };

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];

  return {
    roomName: room.name,
    room,
    lang,
    apartment,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomContent);
