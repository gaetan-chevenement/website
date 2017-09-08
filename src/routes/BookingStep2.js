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
  state = {
    isValidating: true,
  };

  componentWillMount() {
    const { room, lang, roomId, booking, actions } = this.props;
    if ( !room ) {
      route(`/${lang}/booking/${roomId}/`);
    }

    actions.validateBooking(booking);
  }

  render(route) {
    const {
      lang,
      roomId,
    } = route;
    const {
      roomName,
      isValidating,
    } = this.props;

    if ( isValidating ) {
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
          <Summary {...route} />

          <nav class="text-center">
            <section style="margin-top: 2rem; text-align: center;">
              <Button raised
                label="Back"
                icon="arrow_backward"
                href={`/${lang}/booking/${roomId}/1`}
              />
              {' '}
              <Button raised primary
                label="Continue"
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
} };

function mapStateToProps({ rooms, booking }) {
  return {
    roomName: (rooms[route.roomId] || {}).name,
    isValidating: booking.isValidating,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingStep2);
