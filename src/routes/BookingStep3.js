import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { route }              from 'preact-router';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { Button }             from 'react-toolbox/lib/button';
import * as actions           from '~/actions';
import Utils                  from '~/utils';

class BookingStep3 extends PureComponent {
  componentWillMount() {
    const {
      lang,
      room,
      booking,
      actions,
    } = this.props;

    if ( room === undefined ) {
      route(`/${lang}/booking/${booking.roomId}/2`);
    }

    return actions.saveBooking({ room, booking })
      .then(({ response: { rentingId } }) => (
        route(`/${lang}/renting/${rentingId}`)
      ))
      .catch(console.error);
  }

  render() {
    const {
      lang,
      hasErrors,
      room,
      booking: { errors },
    } = this.props;

    if ( hasErrors ) {
      return (
        <IntlProvider definition={definition[lang]}>
          <div class="content">
            <h1>
              <Text id="title">Booking failed for room</Text><br />
              <em>{room.name}</em>
            </h1>

            { errors.isUnavailable ? (
              <section>
                <p>
                  This room is no longer available.<br />
                  Please choose another room.
                </p>
              </section>
            ) : '' }

            { errors.hasPriceChanged ? (
              <div>
                <section>
                  <p>
                    The price of the room has changed.<br />
                    Please check the updated price before continuing.
                  </p>
                </section>

                <nav class="text-center">
                  <section style="margin-top: 2rem; text-align: center;">
                    <Button raised
                      label="Back to Booking Summary"
                      icon="arrow_backward"
                      href={`/${lang}/booking/${room.id}/2`}
                    />
                  </section>
                </nav>
              </div>
            ) : '' }

            { errors.unexpected ? (
              <section>
                <p>
                  An unexpected error occured.<br />
                  { errors.unexpected }
                </p>
              </section>
            ) : '' }
          </div>
        </IntlProvider>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
          <p><Text>Your invoice is being generated</Text></p>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
} };

function mapStateToProps({ route: { lang }, rooms, booking }) {
  return {
    lang,
    room: rooms[booking.roomId],
    booking,
    hasErrors: Utils.hasErrors(booking),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingStep3);
