import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }   from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import { DatePicker }         from 'react-toolbox/lib/date_picker';
import { Input }              from 'react-toolbox/lib/input';
import { Button }             from 'react-toolbox/lib/button';
import * as actions           from '../../actions';
import PackPicker							from '../../containers/booking/PackPicker';
import style                  from './style';

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

class BookingStep1 extends PureComponent {
  @autobind
  handleChange(value, event) {
    this.props.actions.updateBooking({ [event.target.name]: value });
  }

  // Note: `user` comes from the URL, courtesy of our router
  render({ lang, room }) {
    const { bookingDate, checkinDate, name, email } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <div class={style.profile}>
          <h1><Text id="title">Booking details for room</Text> {room}</h1>

          <section>
            <p>
              <Text id="description">
               This room is available immediatly and renting will start on the
              </Text>
              <b>{' '}{new Date(bookingDate).toLocaleDateString(lang)}</b>
            </p>

            <Input type="text"
              label="Name"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
            <Input type="email"
              label="Email address"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
            <DatePicker
              label="Check-in Date"
              name="checkinDate"
              value={checkinDate}
              onChange={this.handleChange}
            />
          </section>

          <section>
            <h3>Choose Your Housing Pack</h3>
            <PackPicker />
          </section>

          <section style="margin-top: 2rem; text-align: center;">
            <Button raised primary
              label="Next"
              icon="forward"
              href={`/${lang}/room/${room}/2`}
            />
          </section>
        </div>
      </IntlProvider>
    );
  }
}

function mapStateToProps(state) {
  return { ...state.booking };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingStep1);
