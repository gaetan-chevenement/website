import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { route }              from 'preact-router';
import autobind               from 'autobind-decorator';
import capitalize             from 'lodash/capitalize';
import D                      from 'date-fns';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import {
  PACK_PRICES,
  DEPOSIT_PRICES,
}                             from '~/const';
import theme                  from './theme';

const _ = { capitalize };

class BookingStep2 extends PureComponent {
  componentWillMount() {
    const { room, lang, roomId } = this.props;
    if ( !room ) {
      route(`/${lang}/booking/${roomId}/`);
    }
  }

  @autobind
  renderDetails(children) {
    return (
      <dl class="grid-2 has-gutter">
        {children.map((child, i) => i % 2 ?
          <dd class="four-fifths margin-y-none">{child}</dd> :
          <dt class="one-fifth">{child}</dt>
        )}
      </dl>
    );
  }

  // Note: `user` comes from the URL, courtesy of our router
  render() {
    const {
      lang,
      room,
      apartment,
      booking: {
        bookingDate,
        checkinDate,
        pack,
        firstName,
        lastName,
        email,
      },
      totalRent,
      checkinPrice,
      proratedRent,
      firstMonths,
    } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <div class="grid has-gutter-xl">
          <div class="two-thirds">
            <section>
              <h4>Housing Pack</h4>
              <p>
                You have selected a {_.capitalize(pack)} housing-pack.
              </p>
              <p>{this.renderDetails([
                <Text>Amount:</Text>,
                <b>{PACK_PRICES[apartment.addressCity].basic / 100}€</b>,
                <Text>Due date:</Text>,
                <span><b>Immediately</b>*</span>,
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
            </section>
            <section>
              <h4>Check-in</h4>
              <p>
                Your checkin is scheduled on the
                <b> {new Date(checkinDate).toLocaleDateString(lang)} </b>
                at
                <b> {D.format(checkinDate, 'HH:mm')} (Paris time) </b>
                {checkinPrice !== 0 ? (
                  <span>An extra-fee is applied when checking-in outside of
                    working hours. You can go back and select a different
                    check-in time or upgrade to a different Housing Pack.
                  </span>
                ) : ''}
              </p>
              {pack !== 'basic' ? (
                <p>
                  The price of a check-in at any time is included in
                  your housing pack.
                </p>
              ) : (
                checkinPrice === 0 ? (
                  <p>
                    The price of a check-in during working hours is included
                    in your housing pack.
                  </p>
                ) : (
                  <p>{this.renderDetails([
                    <Text>Amount:</Text>,
                    <b>{checkinPrice / 100}€</b>,
                    <Text>Due date:</Text>,
                    <Text>Prior to the checkin</Text>,
                  ])}</p>
                )
              )}
            </section>
            <section>
              <h4>Monthly Rent</h4>
              <p>
                <Text id="description">This room is available</Text>
                { D.compareDesc( bookingDate, new Date() ) === 1 ?
                  ' immediatly ' :
                  ` from the ${bookingDate.toLocaleDateString()} `
                }
                <Text>and rent starts on the</Text>
                <b>{' '}{new Date(bookingDate).toLocaleDateString(lang)}</b>.
                The first rents (including water, eletricity, gas, unlimited
                wifi, housing insurance and maintenance) would be:
              </p>
              <p>{this.renderDetails([
                <span>{firstMonths[0]}. <Text>rent</Text>:</span>,
                <b>{proratedRent / 100}€</b>,
                <span>{firstMonths[1]}. <Text>rent</Text>:</span>,
                <b>{totalRent / 100}€</b>,
                <span>{firstMonths[2]}. <Text>rent</Text>:</span>,
                <b>{totalRent / 100}€</b>,
                <Text>Due date:</Text>,
                <Text>
                  First rent is due prior to the checkin and subsequent rents
                  are due on the first of the month.
                </Text>,
              ])}</p>
            </section>
            <section>
              <h4>Security deposit</h4>
              <p>
                <Text id="description">
                 The security deposit is 100% reimbursed at the end of your
                 stay if there are no fees to be withheld (damages,
                overconsumption, etc.).
                </Text>
              </p>
              <p>{this.renderDetails([
                <Text>Amount:</Text>,
                <b>{DEPOSIT_PRICES[apartment.addressCity] / 100}€</b>,
                <Text>Due date:</Text>,
                <Text>Prior to the checkin</Text>,
              ])}</p>
            </section>
          </div>

          <div class="one-third">
            <section>
              <h4><Text>Accommodation details</Text></h4>
              <ul class={theme.unstyled}>
                <li>{room.name.split('-')[1]}</li>
                <li>{apartment.addressStreet}</li>
                <li>{apartment.addressCity} {apartment.addressZipcode}</li>
              </ul>
            </section>
            <section>
              <h4><Text>Personal details</Text></h4>
              <ul class={theme.unstyled}>
                <li>{firstName} {lastName}</li>
                <li>{email}</li>
              </ul>
            </section>
          </div>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
} };

function mapStateToProps({ route: { lang, roomId }, booking, rooms, apartments }) {
  const room = rooms[roomId];
  const totalRent = room['current price'] + room['service fees'];
  const { bookingDate, checkinDate, pack } = booking;

  return {
    lang,
    room,
    apartment: room && apartments[room.ApartmentId],
    booking,
    totalRent,
    proratedRent: Utils.prorateFirstRent(totalRent, bookingDate.getTime()),
    firstMonths: Utils.getFirstMonths(bookingDate),
    checkinPrice: Utils.getCheckinPrice(checkinDate, pack),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingStep2);
