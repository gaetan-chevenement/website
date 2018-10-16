import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { route }              from 'preact-router';
import { bindActionCreators } from 'redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import RoomContent            from '~/containers/room/RoomContent';
import * as actions           from '~/actions';
import Header                 from '~/containers/room/Header';
import SpecialOfferBanner     from '~/containers/SpecialOfferBanner';

class Room extends PureComponent {

  static async prefetch(lang, roomId, dispatch) {
    return Room.loadData(lang, roomId, {
      getRoom: (roomId) => dispatch(actions.getRoom(roomId)),
      getDistrict: (districtId) => dispatch(actions.getDistrict(districtId)),
    });
  }

  static async loadData(lang, roomId, actions) {
    try {
      const { response: {
        // data: [roomData],
        included: [apartmentData],
      } } = await actions.getRoom(roomId);
      const districtId = apartmentData.attributes._DistrictId;

      // This trick was used to allow linking from WordPress to the new website
      // if ( roomData.id !== roomId && typeof window !== 'undefined' ) {
      //   return route(window.location.pathname.replace(/[\w-]+$/, roomData.id));
      // }

      return actions.getDistrict(districtId);
    }
    catch (e) {
      if (e.error.isNotFound) {
        route(`/${lang}/404`);
      }
      else {
        throw e;
      }
    }

  }

  componentWillMount() {
    if ( !this.props.room ) {
      return Room.loadData(this.props.lang, this.props.roomId, this.props.actions);
    }
  }

  componentWillReceiveProps({ roomId }) {
    if ( roomId !== this.props.roomId ) {
      Room.loadData(roomId, this.props.actions);
    }
  }

  render() {
    const {
      roomId,
      apartmentId,
      isLoading,
    } = this.props;

    if ( isLoading ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <div>
        <Header roomId={roomId} apartmentId={apartmentId} />
        <RoomContent roomId={roomId} apartmentId={apartmentId} />
        <SpecialOfferBanner />
      </div>
    );
  }
}

function mapStateToProps({ route: { lang }, apartments, rooms }, { roomId }) {
  const room = rooms[roomId];

  if ( !room || room.isLoading || !('pic 0 url' in room) ) {
    return { isLoading: true };
  }

  return {
    roomId,
    apartmentId: room.ApartmentId,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
