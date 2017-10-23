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
    const { roomId, actions } = this.props;

    actions.updateBooking({ roomId });
  }

  componentDidMount() {
    const {
      roomName,
      hasErrors,
      roomId,
      actions,
    } = this.props;

    if ( roomName === undefined ) {
      actions.getRoom(roomId);
    }

    if ( hasErrors ) {
      scrollTo(0, 0);
    }
  }

  // Note: `user` comes from the URL, courtesy of our router
  render() {
    const {
      lang,
      roomId,
      roomName,
      isRoomLoading,
      isRoomAvailable,
      isEligible,
      hasAcceptedTerms,
    } = this.props;

    if ( isRoomLoading ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    if ( roomName === undefined ) {
      return (
        <IntlProvider definition={definition[lang]}>
          <h1 class="content">
            <Text id="errors.room">
              Sorry, there was an error preparing your booking for this room.
            </Text>
          </h1>
        </IntlProvider>
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
            <BookingForm lang={lang} /> :
            <p><Text id="errors.unavailable">Sorry, this room isn't available for booking.</Text></p>
          }

          <nav class="text-center">
            <Button raised primary
              label="Continue"
              icon="forward"
              href={`/${lang}/booking/${roomId}/2`}
              disabled={!isEligible || !hasAcceptedTerms}
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
  errors: {
    unavailable: 'Désolé, cette chambre n\'est plus dispobible.',
    room: 'Désolé, une erreur est survenue lors de la préparation de votre réservation.',
  },
  button: 'Continuer',
} };

function mapStateToProps({ route: { lang }, rooms, booking }, { roomId }) {
  const room = rooms[roomId];

  return {
    lang,
    roomName: room && room.name,
    roomError: room && room.error,
    isRoomLoading: !room || room.isLoading,
    isRoomAvailable: room && Utils.isRoomAvailable( room ),
    isEligible: booking.isEligible,
    hasAcceptedTerms: booking.hasAcceptedTerms,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingStep1);
