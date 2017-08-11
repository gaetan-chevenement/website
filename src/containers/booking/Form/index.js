import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider } from 'preact-i18n';
import autobind               from 'autobind-decorator';
import { DatePicker }         from 'react-toolbox/lib/date_picker';
import { TimePicker }         from 'react-toolbox/lib/time_picker';
import { Input }              from 'react-toolbox/lib/input';
import { Button }             from 'react-toolbox/lib/button';
import { Checkbox }           from 'react-toolbox/lib/checkbox';
import * as actions           from '~/actions';
import FeatureList						from '~/components/booking/FeatureList';
import PackPicker							from '../PackPicker';
import theme                  from './theme';

const definition = { 'fr-FR': {
  title: 'Réservation de la chambre',
  datetime: 'Date et heure',
  description: 'Cette chambre est disponible immédiatement et la location commencera au',
  pack: {
    basic: 'Basique',
    comfort: 'Confort',
    privilege: 'Privilège',
  },
} };

class Form extends PureComponent {
  state = {
    firstName: {},
    lastName: {},
    email: {},
    checkinDate: {},
  };

  @autobind
  handleChange(value, event) {
    this.props.actions.updateBooking({ [event.target.name]: value.trim() });
  }

  // for some reason, event is sometimes undefined with DatePicker
  @autobind
  handleDateChange(value, event) {
    this.props.actions.updateBooking({ checkinDate: value });
  }

  // Note: `user` comes from the URL, courtesy of our router
  render({ lang, roomId }) {
    const { booking } = this.props;
    const {
      firstName,
      lastName,
      email,
      checkinDate,
    } = this.state;

    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <section>
            <Input type="text"
              label="First Name"
              name="firstName"
              value={booking.firstName}
              onChange={this.handleChange}
              required={firstName.isRequired}
              errored={firstName.hasErrored}
            />
            <Input type="text"
              label="Last Name"
              name="lastName"
              value={booking.lastName}
              onChange={this.handleChange}
              required={lastName.value}
              errored={lastName.value}
            />
            <Input type="email"
              label="Email address"
              name="email"
              value={booking.email}
              onChange={this.handleChange}
              required={email.isRequired}
              errored={email.hasErrored}
            />
          </section>

          <section>
            <h3>Choose Your Housing Pack</h3>
            <PackPicker />
          </section>

          <section>
            <h3>Detailed comparison</h3>
            <FeatureList />
          </section>

          <section>
            <h3>Planned date and time of check-in</h3>
            <DatePicker
              label="Check-in Date"
              name="checkinDate"
              locale={lang.split('-')[0]}
              value={booking.checkinDate}
              onChange={this.handleDateChange}
              required={checkinDate.isRequired}
              errored={checkinDate.hasErrored}
            />
            <TimePicker
              label="Check-in Time (Can be changed at any time)"
              name="checkinDate"
              value={booking.checkinDate}
              onChange={this.handleDateChange}
              required={checkinDate.isRequired}
              errored={checkinDate.hasErrored}
            />
          </section>

          <section>
            <h3>Eligibility, Terms and Conditions</h3>
            <p>
              Before booking, you need to ensure you are eligibile for an
              accommodation with Chez Nestor:
              <Button
                icon="launch"
                href="https://forms.chez-nestor.com/72003771604953"
                target="_blank"
              >
                Test your eligibility
              </Button>
            </p>
            <p>
              <Checkbox
                name="isEligible"
                checked={booking.isEligible}
                required
                onChange={this.handleChange}
                field={theme.eligible}
              >
                &nbsp;I confirm that I am eligible,
                that I am able to provide all the required documents,
                and that I have read and accepted the{' '}
                <a
                  href="https://drive.google.com/file/d/0B8dLiyBmm3wJa1IwbWsxbk85LWs/view"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  terms and conditions.
                </a>
              </Checkbox>
            </p>
          </section>
        </div>
      </IntlProvider>
    );
  }
}

function mapStateToProps({ booking }) {
  return { booking };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
