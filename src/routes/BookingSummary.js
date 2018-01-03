import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button }             from 'react-toolbox/lib/button';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import Summary                from '~/containers/booking/Summary';

class BookingStep2 extends PureComponent {
  componentDidMount() {
    const {
      actions,
      renting,
      rentingId,
      bookingDate,
    } = this.props;

    if ( !renting ) {
      return Promise.all([
        actions.getRenting(rentingId),
        actions.listOrders({ rentingId }),
      ])
        .then(([{ response }]) =>
          !bookingDate && actions.getRoom(response.data.relationships.Room.data.id)
        );
    }
  }

  render() {
    const {
      lang,
      roomId,
      roomName,
      isLoading,
      packOrderId,
      rentingId,
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
                href={`/${lang}/booking/${roomId}`}
              />
              {' '}
              <Button raised primary
                label={<Text id="forward">Book the room</Text>}
                icon="payment"
                href={`/${lang}/payment/${packOrderId}?returnUrl=/${lang}/welcome/${rentingId}`}
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
  forward: 'Réserver la chambre',
} };

function mapStateToProps({ rentings, rooms, booking, orders }, { lang, rentingId }) {
  const renting = rentings[rentingId];
  const room = renting && rooms[renting.RoomId];
  const bookingDate = room && Utils.getBookingDate(room);
  const packOrder = Utils.classifyRentingOrders({ rentingId, orders }).pack;

  if ( !renting || renting.isLoading || !room || room.isLoading || !bookingDate ) {
    return { isLoading: true };
  }

  return {
    lang,
    rentingId,
    renting,
    roomId: room.id,
    roomName: room.name,
    bookingDate,
    packOrderId: packOrder && packOrder.id,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingStep2);
