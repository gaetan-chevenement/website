import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import { Button }             from 'react-toolbox/lib/button';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import Form							      from '~/containers/booking/Form';
import * as actions           from '~/actions';

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

class BookingStep1 extends PureComponent {
  componentWillMount() {
    const {
      room,
      roomId,
      actions: { fetchRoom, receiveRoom, receiveApartment },
    } = this.props;

    if ( !room ) {
      fetchRoom({ id: roomId });
      fetch(
        `http://localhost:3000/forest/Room/${roomId}`
      )
        .then((result) => result.json())
        .then((response) =>
          batch(
            receiveRoom(response.data),
            receiveApartment(response.included[0])
          )
        )
        .catch(console.error);
    }
  }

  // Note: `user` comes from the URL, courtesy of our router
  render() {
    const { lang, roomId, room } = this.props;

    if ( !room ) {
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

    if ( room.isLoading ) {
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
            <em>{room.name}</em>
          </h1>

          { /* room.availability */ true ?
            <Form lang={lang} /> :
            <p>Sorry, this room isn't available for booking.</p>
          }

          <nav class="text-center">
            <Button raised primary
              label="Next"
              icon="forward"
              href={`/${lang}/booking/${roomId}/2`}
            />
          </nav>
        </div>
      </IntlProvider>
    );
  }
}

function mapStateToProps({ route, rooms }) {
  return {
    ...route,
    room: rooms[route.roomId],
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingStep1);
