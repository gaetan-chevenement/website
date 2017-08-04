import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }   from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import capitalize             from 'lodash/capitalize';
import D                      from 'date-fns';
import { Button }             from 'react-toolbox/lib/button';
import Utils                  from '../../utils';
import * as actions           from '../../actions';
import {
  PACK_PRICES,
  DEPOSIT_PRICES,
}                             from '../../const';
import style                  from './style';

const _ = { capitalize };

const definition = { 'fr-FR': {
} };

class BookingStep3 extends PureComponent {
  @autobind
  handleChange(value, event) {
    this.props.actions.updateBooking({ [event.target.name]: value });
  }

  @autobind
  renderDetails(children) {
    return (
      <dl class="grid-2 has-gutter">
        {children.map((child, i) =>
          <dt class={i % 2 ? 'four-fifths' : 'one-fifth'}>{child}</dt>
        )}
      </dl>
    );
  }

  // Note: `user` comes from the URL, courtesy of our router
  render({ lang, room }) {
    const {
      bookingDate,
      checkinDate,
      checkinTime,
      pack,
      firstName,
      lastName,
      email,
      city,
      rentAmount,
    } = this.props;
    const proratedRent = Utils.prorateFirstRent(rentAmount, bookingDate);
    const [firstMonth, secondMonth, thirdMonth] = [0, 1, 2].map((offset) =>
      D.format(D.addMonths(bookingDate, offset), 'MMM')
    );
console.log(bookingDate, checkinTime);
    return (
      <IntlProvider definition={definition[lang]}>
        <div class={style.profile}>
          <h1><Text id="title">Booking summary for room</Text> {room}</h1>

          <div class="grid has-gutter-xl">
            <section>
              <h3>Housing Pack</h3>
              <p>
                You have selected a {_.capitalize(pack)} housing-pack.
              </p>
              <p>{this.renderDetails([
                <Text>Amount:</Text>,
                <b>{PACK_PRICES[city].basic / 100}€</b>,
                <Text>Due date:</Text>,
                <b>Immediately*</b>,
              ])}</p>
              <p>
                <i>
                  * Until your Housing Pack is paid, the bedroom remains
                  available and can be booked by someone else. From July to
                  October, we recommend that you confirm your booking
                  quickly as we receive tens of accommodation requests every
                  week.
                </i>
              </p>

              <h3>Check-in</h3>
              <p>
                Your checkin is scheduled on the
                <b>{' '}{new Date(checkinDate).toLocaleDateString(lang)}{' '}</b>
                at
                <b> {D.format(checkinTime, 'hh:mm')} (Paris time)</b>
              </p>
              <p>
                The price of a check-in during working hours is included in
                your housing pack.
              </p>

              <h3>Monthly Rent</h3>
              <p>
                <Text id="description">
                 This room is available immediatly and rent starts on the
                </Text>
                <b>{' '}{new Date(bookingDate).toLocaleDateString(lang)}</b>.
                The first rents (including water, eletricity, gas, unlimited wifi,
                housing insurance and maintenance) would be:
              </p>
              <p>{this.renderDetails([
                <span>{firstMonth}. <Text>amount</Text>:</span>,
                <b>{proratedRent / 100}€</b>,
                <span>{secondMonth}. <Text>amount</Text>:</span>,
                <b>{rentAmount / 100}€</b>,
                <span>{thirdMonth}. <Text>amount</Text>:</span>,
                <b>{rentAmount / 100}€</b>,
                <Text>Due date:</Text>,
                <Text>
                  First rent is due prior to the checkin and subsequent rents
                  are due on the first of the month.
                </Text>,
              ])}</p>

              <h3>Security deposit</h3>
              <p>
                <Text id="description">
                 The security deposit is 100% reimbursed at the end of your stay
                 if there are no fees to be withheld (damages, overconsumption, etc.).
                </Text>
              </p>
              <p>{this.renderDetails([
                <Text>Amount:</Text>,
                <b>{DEPOSIT_PRICES[city] / 100}€</b>,
                <Text>Due date:</Text>,
                <Text>Prior to the checkin</Text>,
              ])}</p>
            </section>

            <section class="one-third">
              <h3><Text>Your details</Text></h3>
              <ul>
                <li>{firstName} {lastName}</li>
                <li>{email}</li>
              </ul>
            </section>
          </div>

          <section style="margin-top: 2rem; text-align: center;">
            <Button raised
              label="Back"
              icon="arrow_backward"
              href={`/${lang}/booking/${room}/2`}
            />
            {' '}
            <Button raised primary
              label="Confirm"
              icon="forward"
              href={`/${lang}/booking/${room}/3`}
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingStep3);
