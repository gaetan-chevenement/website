import { IntlProvider, Text } from 'preact-i18n';
import { route }              from 'preact-router';
import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import { bindActionCreators } from 'redux';
import { Button }             from 'react-toolbox/lib/button';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import Summary                from '~/containers/booking/Summary';
import SpecialOfferBanner     from '~/containers/SpecialOfferBanner';
import Heading                from '~/components/booking/Heading';

class BookingSummary extends PureComponent {
  @autobind
  async handleSubmit() {
    const {
      lang,
      summary,
      renting,
      packOrderId,
      actions,
    } = this.props;
    const paymentUrl = `/${lang}/payment/${packOrderId}`;
    const returnUrl = `/${lang}/welcome/${renting.id}`;
    const rentingPrice = renting.price + renting.serviceFees;

    await actions.validateSummary(summary);

    route(`${paymentUrl}?returnUrl=${returnUrl}&rentingPrice=${rentingPrice}`);
  }

  componentDidMount() {
    const {
      actions,
      renting,
      rentingId,
      bookingDate,
    } = this.props;

    return Promise.all([
      !renting && actions.getRenting(rentingId),
      actions.listOrders({ rentingId }),
    ])
      .then(([{ response }]) =>
        !bookingDate && actions.getRoom(response.data.relationships.Room.data.id)
      );
  }

  render() {
    const {
      lang,
      summary,
      room,
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
          <Heading room={room} type="summary" />

          <nav>
            <section>
              <Button raised
                label={<Text id="back">Back</Text>}
                icon="arrow_backward"
                href={`/${lang}/booking/${room.id}`}
              />
            </section>
          </nav>

          <Summary />

          <nav>
            <section style="margin-top: 2rem; text-align: center;">
              <Button raised primary
                label={<Text id="forward">Book the room</Text>}
                icon="payment"
                onClick={this.handleSubmit}
                disabled={
                  !summary.check0 ||
                  !summary.check1 ||
                  !summary.check2 ||
                  !summary.check3 ||
                  !summary.check4
                }
              />
            </section>
          </nav>
          <SpecialOfferBanner />
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

function mapStateToProps(state, { lang, rentingId }) {
  const { rentings, rooms, apartments, orders, summary } = state;
  const renting = rentings[rentingId];
  const room = renting && rooms[renting.RoomId];
  const apartment = room && apartments[room.ApartmentId];
  const bookingDate = room && Utils.getBookingDate(room);
  const { pack: packOrder } = Utils.classifyRentingOrders({ rentingId, orders });

  if (
    !renting || renting.isLoading ||
    !room || room.isLoading ||
    !apartment || apartment.isLoading ||
    orders.isLoading || !bookingDate
  ) {
    return { isLoading: true };
  }

  return {
    lang,
    summary,
    rentingId,
    renting,
    room: { ...room, name: Utils.localizeRoomName(room.name, lang) },
    bookingDate,
    packOrderId: packOrder && packOrder.id,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingSummary);
