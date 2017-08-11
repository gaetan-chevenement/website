import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { route }              from 'preact-router';

const definition = { 'fr-FR': {
} };

class BookingStep3 extends PureComponent {
  componentWillMount() {
    const { room, lang, roomId } = this.props;
    if ( !room ) {
      route(`/${lang}/booking/${roomId}/`);
    }
  }

  // Note: `user` comes from the URL, courtesy of our router
  render({ lang, roomId }) {
    const { room } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <div class="content">
          <h1>
            <Text id="title">Booking confirmed for room</Text><br />
            <em>{room.name}</em>
          </h1>

          <section>
            <p>
              Thank you!&nbsp;
              An email has been sent with instructions to pay your Housing Pack.&nbsp;
              Only then will the room be made unavailable for others to book.&nbsp;
            </p>
          </section>
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

export default connect(mapStateToProps)(BookingStep3);
