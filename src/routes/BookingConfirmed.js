import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { Button }             from 'react-toolbox/lib/button';
import * as actions           from '~/actions';
import _const                 from '~/const';

const { IDENTITY_FORM_URL } = _const;
console.log('IDENTITY_FORM_URL', IDENTITY_FORM_URL);

class BookingStep3 extends PureComponent {
  componentDidMount() {
    const {
      rentingId,
      renting,
      actions,
    } = this.props;

    if ( !renting ) {
      return actions.getRenting(rentingId);
    }
  }

  render() {
    const {
      lang,
      isLoading,
      roomName,
      email,
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
            <Text id="title">Booking confirmed for room</Text><br />
            <em>{roomName}</em>
          </h1>

          <section>
            <p>
              <Text id="instructions">
                You will receive a confirmation email with further instructions.
                The first step is to provide your personal details so that we can
                edit the lease agreement.
              </Text>
            </p>

            <p class="text-center">
              <Button primary raised href={`${IDENTITY_FORM_URL}?clientId=${email}`}>
                <Text id="fill">Fill in the form</Text>
              </Button>
            </p>
          </section>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  title: 'Réservation confirmée pour la chambre',
  instructions: `
    Vous allez recevoir un email de confirmation avec de plus amples instructions.
    La première étape consiste à fournir vos données personnelles afin que nous
    puissions éditer le contrat de location.
  `,
  fill: 'Remplir le formulaire',
} };

function mapStateToProps({ route: { lang }, rentings, rooms, client }, { rentingId }) {
  const renting = rentings[rentingId];

  if ( !renting || renting.isLoading ) {
    return { isLoading: true };
  }

  return {
    lang,
    roomName: rooms[renting.RoomId].name,
    email: client.email,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingStep3);
