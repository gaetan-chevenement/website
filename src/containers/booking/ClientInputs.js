import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import { IntlProvider, Text }       from 'preact-i18n';
import autobind               from 'autobind-decorator';
import { Input }              from 'react-toolbox/lib/input';
import * as actions           from '~/actions';

class ClientInputs extends PureComponent {
  @autobind
  handleChange(value, event) {
    const { actions } = this.props;

    batch(
      actions.updateBooking({ [event.target.name]: value }),
      actions.deleteBookingError(event.target.name)
    );
  }

  render() {
    const {
      lang,
      booking: { errors },
      booking,
    } = this.props;

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

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientInputs);
