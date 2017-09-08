import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { Button }             from 'react-toolbox/lib/button';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import BookingForm					  from '~/containers/booking/BookingForm';
import * as actions           from '~/actions';
import Utils                  from '~/utils';

class BookingStep1 extends PureComponent {
  componentWillMount() {
    const {
      room,
      roomId,
      actions,
    } = this.props;

    if ( !room ) {
      actions.getRoom(roomId);
    }
  }

  // Note: `user` comes from the URL, courtesy of our router
  render(route) {
    const {
      lang,
      roomId,
    } = route;
    const {
      roomName,
      roomError,
      isRoomLoading,
      isEligible,
      hasErrors,
      isRoomAvailable,
    } = this.props;

    if ( roomError ) {
      return (
        <IntlProvider definition={definition[lang]}>
          <h1 class="content">
            <Text>
              Sorry, there was an error preparing your booking for this room.
            </Text>
          </h1>
        </IntlProvider>
      );
    }

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
          <h1>
            <Text id="title">Booking details for room</Text><br />
            <em>{roomName}</em>
          </h1>

          { isRoomAvailable ?
            <BookingForm {...route} /> :
            <p>Sorry, this room isn't available for booking.</p>
          }

          <nav class="text-center">
            <Button raised primary
              label="Continue"
              icon="forward"
              href={`/${lang}/booking/${roomId}/2`}
              disabled={!isEligible || hasErrors}
            />
          </nav>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  title: 'Réservation de la chambre',
  datetime: 'Date et heure',
  description: 'Cette chambre est disponible immédiatement et la location commencera au',
  pack: {
    basic: 'Basique',
    comfort: 'Confort',
    privilege: 'Privilège',
  },
} };

function mapStateToProps({ rooms, booking }, { roomId }) {
  const room = rooms[roomId];

  return {
    roomName: room && room.name,
    roomError: room && room.error,
    roomIsLoading: room && room.isLoading,
    hasErrors: Object.keys(booking.errors).length > 0,
    isEligible: booking.isEligible,
    isRoomAvailable: room && Utils.isRoomAvailable( room ),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingStep1);
