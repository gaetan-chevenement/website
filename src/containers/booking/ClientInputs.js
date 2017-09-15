import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import { IntlProvider }       from 'preact-i18n';
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
            label="First Name"
            name="firstName"
            value={booking.firstName}
            onChange={this.handleChange}
            error={errors.firstName}
          />
          <Input type="text"
            label="Last Name"
            name="lastName"
            value={booking.lastName}
            onChange={this.handleChange}
            error={errors.lastName}
          />
          <Input type="email"
            label="Email address"
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
