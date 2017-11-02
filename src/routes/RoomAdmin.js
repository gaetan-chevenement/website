import { IntlProvider } from 'preact-i18n';
import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import Promise                from 'bluebird';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import FeaturesDetails        from '~/containers/roomAdmin/FeaturesDetails';
import * as actions           from '~/actions';


class Room extends PureComponent {
  componentWillMount() {
    const { roomId, actions } = this.props;

    return Promise.resolve()
      .then(() => actions.getRoom(roomId))
      .then(({ response }) => Promise.all([
        actions.getDistrict(response.included[0].id),
        actions.listFeatures(roomId, response.included[0].id),
        actions.listPictures(roomId, response.included[0].id),
      ]));
  }

  render() {
    const {
      roomId,
      apartmentId,
      lang,
      isRoomLoading,
    } = this.props;
    if ( isRoomLoading ) {
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
            <FeaturesDetails roomId={roomId} apartmentId={apartmentId} />
          </section>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {

} };

function mapStateToProps({ route: { lang, admin }, apartments, rooms }, { roomId }) {
  const room = rooms[roomId];

  return {
    roomId,
    admin,
    apartmentId: room && room.ApartmentId,
    lang,
    roomError: room && room.error,
    room,
    isRoomLoading: !room || room.isLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
