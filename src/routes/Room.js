import { IntlProvider }       from 'preact-i18n';
import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { route }              from 'preact-router';
import { bindActionCreators } from 'redux';
import { batch }              from 'redux-act';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import DisplayFeatures        from '~/containers/room/DisplayFeatures';
import Pictures               from '~/containers/room/Pictures';
import HouseMates             from '~/containers/room/HouseMates';
import Description            from '~/containers/room/Description';
import ApartmentDescription   from '~/containers/room/ApartmentDescription';
import * as actions           from '~/actions';


class Room extends PureComponent {
  async loadData(roomId) {
    const { actions } = this.props;

    const { response: {
      data: [roomData],
      included: [apartmentData],
    } } = await actions.getRoom(roomId);
    const districtId = apartmentData.attributes._DistrictId;

    if ( roomData.id !== roomId ) {
      return route(window.location.pathname.replace(/[\w-]+$/, roomData.id));
    }

    // We need to fetch the district before we fetch its terms, otherwise
    // they're going to be lost
    await actions.getDistrict(districtId);

    return batch(
      actions.listTerms([roomId, apartmentData.id, districtId]),
      actions.listPictures([roomId, apartmentData.id]),
      actions.getHouseMates(apartmentData.id),
    );
  }

  componentWillMount() {
    const { roomId } = this.props;
    return this.loadData(roomId);
  }

  componentWillReceiveProps(nextProps) {
    if ( this.props.roomId !== nextProps.roomId ) {
      this.loadData(nextProps.roomId);
    }
  }

  render() {
    const {
      roomId,
      roomName,
      coverPicture,
      apartmentId,
      lang,
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
      <IntlProvider definition={definition[lang]}>
        <div class="content">
          <section>
            <img src={coverPicture} />
            <h2>{roomName}</h2>
            <Pictures roomId={roomId} apartmentId={apartmentId} />
            <Description roomId={roomId} apartmentId={apartmentId} />
            <DisplayFeatures roomId={roomId} apartmentId={apartmentId} />
            <HouseMates apartmentId={apartmentId} roomId={roomId} />
            <ApartmentDescription />
          </section>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {

} };

function mapStateToProps({ route: { lang }, apartments, rooms }, { roomId }) {
  const room = rooms[roomId];

  if ( !room || room.isLoading ) {
    return { isLoading: true };
  }

  return {
    lang,
    roomId,
    roomName: room.name,
    coverPicture: room['cover picture'],
    apartmentId: room.ApartmentId,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
