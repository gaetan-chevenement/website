import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { route }              from 'preact-router';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import * as actions           from '~/actions';
import Utils                  from '~/utils';

class BookingStep3 extends PureComponent {
  componentWillMount() {
    const { room, lang, roomId, booking, actions } = this.props;
    const { fetchRoom, receiveRoom } = actions;
    if ( !room ) {
      route(`/${lang}/booking/${roomId}/`);
    }

    fetchRoom({ id: roomId });
    Utils.fetchRoom(roomId)
      .then((response) => {
        const refetchedRoom = response.data[0].attributes;

        if ( !Utils.isRoomAvailable(refetchedRoom) ) {
          return route(`/${lang}/booking/${roomId}/`);
        }

        if ( refetchedRoom['current price'] > room['current price'] ) {
          receiveRoom(response.data[0]);
          return route(`/${lang}/booking/${roomId}/2?warning=priceChanged`);
        }

        /* eslint-disable promise/no-nesting */
        return Utils.createRenting({ room, booking })
          .then((response) => route(`/${lang}/renting/${response.rentingId}`));
        /* eslint-enable promise/no-nesting */
      })
      .catch(console.error);
  }

  render({ lang, roomId }) {
    return (
      <IntlProvider definition={definition[lang]}>
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
          <p><Text>Your invoice is being generated</Text></p>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
} };

function mapStateToProps({ route, rooms, booking }) {
  return {
    ...route,
    room: rooms[route.roomId],
    booking,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingStep3);
