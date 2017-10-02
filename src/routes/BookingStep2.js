import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { route }              from 'preact-router';
import { Button }             from 'react-toolbox/lib/button';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import * as actions           from '~/actions';
import Summary                from '~/containers/booking/Summary';

class BookingStep2 extends PureComponent {
  componentWillMount() {
    const {
      lang,
      roomName,
      booking,
      actions,
    } = this.props;

    Promise.resolve()
      // refetch the room if necessary (if the price has changed for example)
      .then(() => roomName === undefined && actions.getRoom(booking.roomId))
      // validateBooking has to heppen after fetching the room,
      // as the bookingDate validity might change.
      .then(() => actions.validateBooking(booking))
      .catch(() => {
        return route(`/${lang}/booking/${booking.roomId}/`);
      });
  }

  render() {
    const {
      lang,
      roomId,
      roomName,
      isRoomLoading,
      booking,
    } = this.props;

    if ( isRoomLoading || booking.isValidating ) {
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
            <Text id="title">Booking summary for room</Text><br />
            <em>{roomName}</em>
          </h1>

          <Summary />

          <nav class="text-center">
            <section style="margin-top: 2rem; text-align: center;">
              <Button raised
                label={<Text id="back">Back</Text>}
                icon="arrow_backward"
                href={`/${lang}/booking/${roomId}/1`}
              />
              {' '}
              <Button raised primary
                label={<Text id="forward">Continue</Text>}
                icon="forward"
                href={`/${lang}/booking/${roomId}/3`}
              />
            </section>
          </nav>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  title: 'Récapitulatif de la réservation pour la chambre',
  back: 'Retour',
  forward: 'Continuer',
} };

function mapStateToProps({ route: { lang }, booking, rooms }) {
  const room = rooms[booking.roomId];

  return {
    lang,
    booking,
    roomName: room && room.name,
    isRoomLoading: !room || room.isLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingStep2);
