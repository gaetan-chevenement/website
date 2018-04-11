import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import { IntlProvider, Text } from 'preact-i18n';
import autobind               from 'autobind-decorator';
import { Input }              from 'react-toolbox/lib/input';
import mapDispatchToProps     from '~/actions/mapDispatchToProps';

class ClientInputs extends PureComponent {
  @autobind
  handleChange(value, event) {
    const { actions } = this.props;

    batch(
      actions.updateBooking({ [event.target.name]: value }),
      actions.deleteBookingError(event.target.name)
    );
  }

  render({ lang, booking: { errors }, booking }) {
    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <Input type="text"
            label={<Text id="firstName">First Name</Text>}
            name="firstName"
            value={booking.firstName}
            onChange={this.handleChange}
            error={errors.firstName}
          />
          <Input type="text"
            label={<Text id="lastName">Last Name</Text>}
            name="lastName"
            value={booking.lastName}
            onChange={this.handleChange}
            error={errors.lastName}
          />
          <Input type="email"
            label={<Text id="email">Email address</Text>}
            name="email"
            value={booking.email}
            onChange={this.handleChange}
            error={errors.email}
          />
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  firstName: 'Prénom',
  lastName: 'Nom de famille',
  email: 'Courriel',
} };

function mapStateToProps({ route: { lang }, booking }) {
  return {
    lang,
    booking,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientInputs);
