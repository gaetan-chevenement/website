import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { route }              from 'preact-router';
import { bindActionCreators } from 'redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import RoomContent            from '~/containers/room/RoomContent';
import * as actions           from '~/actions';
import Header                 from '~/containers/room/Header';

class Room extends PureComponent {
  async loadData(roomId) {
    const { actions } = this.props;

    try {
      const { response: {
        data: [roomData],
        included: [apartmentData],
      } } = await actions.getRoom(roomId);
      const districtId = apartmentData.attributes._DistrictId;

      // This trick was used to allow linking from WordPress to the new website
      if ( roomData.id !== roomId && typeof window !== 'undefined' ) {
        return route(window.location.pathname.replace(/[\w-]+$/, roomData.id));
      }

      return actions.getDistrict(districtId);
    }
    catch (e) {
      route(`/${this.props.lang}/404`);
    }

  }

  componentWillMount() {
    if ( !this.props.room ) {
      return this.loadData(this.props.roomId);
    }
  }

  componentWillReceiveProps({ roomId }) {
    if ( roomId !== this.props.roomId ) {
      this.loadData(roomId);
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
