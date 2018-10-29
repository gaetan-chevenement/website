import { IntlProvider, Text } from 'preact-i18n';
import { route }              from 'preact-router';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import { Button }             from 'react-toolbox/lib/button';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import BookingFormSections    from '~/components/booking/BookingFormSections';
import Heading                from '~/components/booking/Heading';
import Utils                  from '~/utils';
import * as actions           from '~/actions';

class BookingForm extends PureComponent {
  @autobind
  async handleSubmit() {
    const {
      room,
      booking,
      actions,
      lang,
    } = this.props;

    await actions.validateBooking(booking);
    const { response: { rentingId } } =
      await actions.saveBooking({ room, booking, lang });

    route(`/${this.props.lang}/summary/${rentingId}`);
  }

  componentWillMount() {
    const { roomId, actions } = this.props;

    actions.updateBooking({ roomId });
  }

  async componentDidMount() {
    const {
      roomId,
      room,
      city,
      packPrices,
      actions,
    } = this.props;
    const promises = [];

    if ( !room ) {
      promises.push(actions.getRoom(roomId));
    }

    if ( (!packPrices || Object.keys(packPrices).length === 0) && city ) {
      promises.push(actions.listProducts({ id: `${city}-*` }));
    }

    return promises;
  }

  componentWillReceiveProps({ roomId, city }) {
    const { actions } = this.props;

    if ( roomId && roomId !== this.props.roomId ) {
      actions.getRoom(roomId);
    }

    if ( city && city !== this.props.city ) {
      actions.listProducts({ id: `${city}-*` });
    }
  }

  // Note: `user` comes from the URL, courtesy of our router
  render() {
    const {
      lang,
      room,
      booking,
      isLoading,
    } = this.props;

    if ( isLoading ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    // This is probably never true
    if ( room.name === undefined ) {
      return (
        <IntlProvider definition={definition[lang]}>
          <h1 class="content">
            <Text id="errors.room">
              Sorry, an error occured while preparing your booking for this room.
            </Text>
          </h1>
        </IntlProvider>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div class="content">
          <Heading room={room} type="details" />

          { room.availableAt === null ?
            <p>
              <Text id="errors.unavailable">
                Sorry, this room isn't available for booking.
              </Text>
            </p> :
            <BookingFormSections />
          }

          <nav class="text-center">
            { booking.isSaving ?
              <ProgressBar type="circular" mode="indeterminate" /> :
              <Button raised primary
                label="Continue"
                icon="forward"
                onClick={this.handleSubmit}
              />
            }
          </nav>
        </div>
      </IntlProvider>
    );
  }
}

function mapStateToProps(state, { roomId }) {
  const { route: { lang }, rooms, apartments, products, booking } = state;
  const room = rooms[roomId];

  if ( !room || room.isLoading ) {
    return { isLoading: true };
  }

  const city = apartments[room.ApartmentId].addressCity;
  const packPrices = Utils.getPackPrices({ products, city });

  return {
    lang,
    roomId,
    room: { ...room, name: Utils.localizeRoomName(room.name, lang) },
    booking,
    city,
    packPrices,
  };
}

const definition = {
  'fr-FR': {
    errors: {
      unavailable: 'Désolé, cette chambre n\'est plus disponible.',
      room: 'Désolé, une erreur est survenue lors de la préparation de votre réservation.',
    },
    button: 'Continuer',
  },
  'es-ES': {
    errors: {
      unavailable: 'Lo sentimos, esta habitación ya no está disponible.',
      room: 'Lo sentimos, se ha producido un error durante la preparación de su reserva.',
    },
    button: 'Continuar',
  },
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingForm);
