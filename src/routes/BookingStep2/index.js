import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { route }              from 'preact-router';
import { Button }             from 'react-toolbox/lib/button';
import Summary                from '~/containers/booking/Summary';

const definition = { 'fr-FR': {
} };

class BookingStep2 extends PureComponent {
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
            <Text id="title">Booking summary for room</Text><br />
            <em>{room.name}</em>
          </h1>
          <Summary />

          <nav class="text-center">
            <section style="margin-top: 2rem; text-align: center;">
              <Button raised
                label="Back"
                icon="arrow_backward"
                href={`/${lang}/booking/${roomId}/1`}
              />
              {' '}
              <Button raised primary
                label="Confirm"
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

function mapStateToProps({ route, rooms }) {
  return {
    ...route,
    room: rooms[route.roomId],
  };
}

export default connect(mapStateToProps)(BookingStep2);
