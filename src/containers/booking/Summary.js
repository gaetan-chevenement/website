import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
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

class Summary extends PureComponent {
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
      roomName,
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
              <h4><Text id="housingPack.title">Housing Pack</Text></h4>
              <p>
                <Text id="housingPack.subtitle.first">You have selected a</Text> {lang === 'en-US' ? _.capitalize(pack) : pack === 'comfort' ? 'Confort' : pack === 'basic' ? 'Basique': pack === 'privilege' ? 'Privilège' : ''}<Text id="housingPack.subtitle.second"> housing-pack.</Text>
              </p>
              <p>{this.renderDetails([
                <Text id="amount">Amount:</Text>,
                <b>{PACK_PRICES[apartment.addressCity][pack] / 100}€</b>,
                <Text id="dueDate.title">Due date:</Text>,
                <span><b><Text id="dueDate.now">Immediately</Text></b>*</span>,
              ])}</p>
              <p>
                <i>
                  <Text id="housingPack.description">* Until your Housing Pack is paid, the bedroom remains
                  available and can be booked by someone else. From July to
                  October, we recommend that you confirm your booking
                  quickly as we receive tens of accommodation requests every
                  week.</Text>
                </i>
              </p>
            </section>
            <section>
              <h4><Text id="checkIn.title">Check-in</Text></h4>
              <p>
                <Text id="checkIn.subtitle.first">Your checkin is scheduled on the</Text>
                <b> {new Date(checkinDate).toLocaleDateString(lang)} </b>
                <Text id="checkIn.subtitle.second">at</Text>
                <b> {D.format(checkinDate, 'HH:mm')} (<Text id="checkIn.subtitle.third">Paris time</Text>). </b>
                {checkinPrice !== 0 ? (
                  <span><Text id="checkIn.price">An extra-fee is applied when checking-in outside of
                    working hours. You can go back and select a different
                    check-in time or upgrade to a different Housing Pack.</Text>
                  </span>
                ) : ''}
              </p>
              {pack !== 'basic' ? (
                <p>
                  <Text id="checkIn.priceIncluded">The price of a check-in at any time is included in
                  your housing pack.</Text>
                </p>
              ) : (
                checkinPrice === 0 ? (
                  <p>
                    <Text id="checkIn.free">The price of a check-in during working hours is included
                    in your housing pack.</Text>
                  </p>
                ) : (
                  <p>{this.renderDetails([
                    <Text id="amount">Amount:</Text>,
                    <b>{checkinPrice / 100}€</b>,
                    <Text id="dueDate.title">Due date:</Text>,
                    <Text id="dueDate.checkIn">Prior to the checkin</Text>,
                  ])}</p>
                )
              )}
            </section>
            <section>
              <h4><Text id="rent.title">Monthly Rent</Text></h4>
              <p>
                <Text id="rent.subtitle.first">This room is available</Text>
                { D.compareAsc( bookingDate, new Date() ) === -1 ?
                  <Text id="rent.subtitle.second"> immediatly </Text> :
                  <div><Text id="rent.subtitle.third"> from the </Text>{bookingDate.toLocaleDateString(lang)} </div>
                }
                <Text id="rent.subtitle.fourth">and rent starts on the</Text>
                <b>{' '}{bookingDate.toLocaleDateString(lang)}</b>.
                <Text id="rent.detail">The first rents (including water, eletricity, gas, unlimited
                wifi, housing insurance and maintenance) would be:</Text>
              </p>
            </section>

            <p>{this.renderDetails([
              <span><Text id="rent.fr" />{firstMonths[0]}.<Text id="rent.en">rent:</Text></span>,
              <b>{proratedRent / 100}€</b>,
              <span><Text id="rent.fr" />{firstMonths[1]}.<Text id="rent.en"> rent:</Text></span>,
              <b>{totalRent / 100}€</b>,
              <span><Text id="rent.fr" />{firstMonths[2]}.<Text id="rent.en"> rent:</Text></span>,
              <b>{totalRent / 100}€</b>,
              <Text id="dueDate.title">Due date:</Text>,
              <Text id="dueDate.rent">First rent is due prior to the checkin and subsequent rents are due on the first of the month.</Text>,
            ])}</p>
            <section>
              <h4><Text id="deposit.title">Security deposit</Text></h4>
              <p>
                <Text id="deposit.subtitle">The security deposit is 100% reimbursed at the end of your
                 stay if there are no fees to be withheld (damages,
                overconsumption, etc.).</Text>
              </p>
              <p>{this.renderDetails([
                <Text id="amount">Amount:</Text>,
                <b>{DEPOSIT_PRICES[apartment.addressCity] / 100}€</b>,
                <Text id="dueDate.title">Due date:</Text>,
                <Text id="dueDate.checkIn">Prior to the checkin</Text>,
              ])}</p>
            </section>
          </div>

          <div class="one-third">
            <section>
              <h4><Text id="acommodation.title">Accommodation details</Text></h4>
              <ul class={theme.unstyled}>
                <li>{roomName.split('-')[1]}</li>
                <li>{apartment.addressStreet}</li>
                <li>{_.capitalize(apartment.addressCity)} {apartment.addressZipcode}</li>
              </ul>
            </section>
            <section>
              <h4><Text id="personal.title">Personal details</Text></h4>
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
  housingPack: {
    title: 'Pack Logement',
    subtitle: {
      first: 'Vous avez choisi un pack logement ',
      second: ' ',
    },
    description: `* Tant que votre pack logement n'est pas payé, la chambre reste
                  disponible et peut être réservée par quelqu'un d'autre. De juillet à
                  Octobre, nous vous recommandons de confirmer votre réservation
                  rapidement car nous recevons des dizaines de demandes de logement chaque semaine.`,
  },
  checkIn: {
    title: 'Checkin',
    subtitle: {
      first: 'Votre checkin est prévu le ',
      second: 'à',
      third: 'heure locale',
    },
    price: `Une taxe supplémentaire est appliquée lors d'un checkin en dehors des
            heures de travail. Vous pouvez revenir en arrière et sélectionner une autre
            heure d'arrivée ou choisir un pack logement supérieur.`,
    priceIncluded: 'Le prix d\'un checkin à toute heure est inclus dans votre pack de logement.',
    free: 'Le prix d\'un checkin pendant les heures de travail est inclus dans votre pack de logement.',
  },
  rent: {
    title: 'Loyer mensuel',
    subtitle: {
      first: 'Cette chambre est disponible',
      second: ' immédiatement ',
      third: ' à partir du ',
      fourth: 'et le loyer commence le ',
    },
    detail: 'Les premiers loyers (comprenant l\'eau, l\'électricité, le gaz, wifi illimitée, assurance habitation et maintenance) seraient:',
    fr: 'Loyer ',
    en: ' :',
  },
  deposit: {
    title: 'Dépôt de garantie',
    subtitle: `Le dépôt de garantie est remboursé à 100% à la fin de votre
              séjour s'il n'y a pas de frais à retenir (dommages,
              surconsommation, etc.).`,
  },
  acommodation: {
    title: 'Détails du logement',
  },
  personal: {
    tile: 'Détails personnels',
  },
  amount: 'Montant:',
  dueDate: {
    title: 'Échéance:',
    now: 'Immédiatement',
    checkIn: 'Avant le checkin',
    rent: 'Le premier loyer est dû avant le checkin et les loyers suivants sont exigibles le premier du mois.',
  },
} };

function mapStateToProps({ route: { lang }, booking, rooms, apartments }) {
  const room = rooms[booking.roomId];
  const totalRent = room ? room['current price'] + room['service fees'] : 0;
  const { bookingDate, checkinDate, pack } = booking;

  return {
    lang,
    roomName: room && room.name,
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

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
