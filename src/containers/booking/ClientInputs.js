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
    const { updateBooking, deleteBookingError } = this.props.actions;

    batch(
      updateBooking({ [event.target.name]: value }),
      deleteBookingError(event.target.name)
    );
  }

  render({ lang }) {
    const { booking } = this.props;
    const { errors } = booking;

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

function mapStateToProps({ booking }) {
  return { booking };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientInputs);
