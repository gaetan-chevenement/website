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
                  <Text id="errors.unavailable.first">This room is no longer available.</Text><br />
                  <Text id="errors.unavailable.last">Please choose another room.</Text>
                </p>
              </section>
            ) : '' }

            { errors.hasPriceChanged ? (
              <div>
                <section>
                  <p>
                    <Text id="price.first">The price of the room has changed.</Text><br />
                    <Text id="price.last">Please check the updated price before continuing.</Text>
                  </p>
                </section>

                <nav class="text-center">
                  <section style="margin-top: 2rem; text-align: center;">
                    <Button raised
                      label={<Text id="back">Back to Booking Summary</Text>}
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
                  <Text id="errors.unexpected">An unexpected error occured.</Text><br />
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
          <p><Text id="invoice">Your invoice is being generated</Text></p>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  title: 'La réservation n\'a pas fonctionner pour la chambre',
  price: {
    first: 'Le prix de la chambre a changé,',
    last: 'Merci de verifier le nouveau de la chambre avant de continuer.',
  },
  back: 'Retour au Récapitulatif de la réservation',
  errors: {
    unavailable: {
      first: 'Cette chambre n\'est plus disponible.',
      last: 'Veuilez en selectionner une autre.',
    },
    unexpected: 'Une erreur est survenue.',
  },
  invoice: 'Votre facture a été générée',

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
