import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import capitalize             from 'lodash/capitalize';
import D                      from 'date-fns';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import _const                 from '~/const';
import theme                  from './theme';

const _ = { capitalize };
const {
  PACK_PRICES,
  DEPOSIT_PRICES,
  HOME_CHECKIN_FEES,
  SPECIAL_CHECKIN_FEES,
  LEASE_SPECIMEN_URL,
} = _const;

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
      room,
      apartment,
      packLevel,
      client: {
        firstName,
        lastName,
        email,
      },
      bookingDate,
      totalRent,
      proratedRent,
      firstMonths,
    } = this.props;
    const homeCheckinFee = HOME_CHECKIN_FEES[packLevel];
    const specialCheckinFee = SPECIAL_CHECKIN_FEES[packLevel];
    const free = (<Text id="free">Free</Text>);

    return (
      <IntlProvider definition={definition[lang]}>
        <div class="grid has-gutter-xl">
          <div class="two-thirds">
            <section>
              <h4><Text id="housingPack.title">Housing Pack</Text></h4>
              <p>
                <Text id="housingPack.subtitle.0">You have selected a </Text>
                <b><Text id={`housingPack.${packLevel}`}>{packLevel}</Text> </b>
                <Text id="housingPack.subtitle.1">housing-pack </Text>
                <Text id="housingPack.subtitle.2">(to pay only once when your reserve).</Text>
              </p>
              <p>{this.renderDetails([
                <Text id="amount">Amount:</Text>,
                <b>{PACK_PRICES[apartment.addressCity][packLevel] / 100}€</b>,
                <Text id="dueDate.title">Due date:</Text>,
                <span><b><Text id="dueDate.now">Immediately</Text></b>*</span>,
              ])}</p>
              <p class="text-italic">
                <Text id="housingPack.description">
                  * Until your Housing Pack is paid, the bedroom remains
                  available and can be booked by someone else. From July to
                  October, we recommend that you confirm your booking
                  quickly as we receive hundreds of accommodation requests every
                  week.
                </Text>
              </p>
            </section>

            <section>
              <h4>Check-in</h4>
              <p>
                <Text id="checkin.subtitle">For your check-in, you have several options:</Text>
              </p>
              <ol>
                <li>
                  <b><Text id="checkin.self.0">Self-service</Text> </b>
                  <Text id="checkin.self.1">any day/time (24/7) at the agency's key safes</Text> -
                  <b> {free}</b>
                </li>
                <li>
                  <b><Text id="checkin.home.0">At home</Text> </b>
                  <Text id="checkin.home.1">Mon. to Fri. (excl. bank holidays) from 9am to 6pm</Text> -
                  <b> {homeCheckinFee ? `${homeCheckinFee / 100}€` : free}</b>
                </li>
                <li>
                  <b><Text id="checkin.special">At home 24/7</Text> </b> -
                  <b> {specialCheckinFee ? `${specialCheckinFee / 100}€` : free}</b>
                </li>
              </ol>
              <p>
                <Text id="checkin.instructions">
                  You will be asked to fill a form to choose your checkin option,
                  date and time at least 72h in advance.
                </Text>
              </p>
              <p>
                <Text id="checkin.checkout">
                  For your check-out, you don't need to tell us an exact date
                  right now. Your contract is flexible and adapts to the length
                  of your stay. As soon as you know which date you'd like to
                  leave, you just need to let our team know at least 30 days in
                  advance!
                </Text>
              </p>
            </section>

            <section>
              <h4><Text id="rent.title">Monthly Rent</Text></h4>
              <p>
                <Text id="rent.subtitle.0">This room is available</Text>
                { D.compareAsc( bookingDate, new Date() ) === -1 ?
                  <Text id="rent.subtitle.1"> immediatly </Text> :
                  <span>
                    <Text id="rent.subtitle.2"> from the </Text>{bookingDate.toLocaleDateString(lang)}{''}
                  </span>
                }
                <Text id="rent.subtitle.3">and rent starts on the</Text>
                <b> {bookingDate.toLocaleDateString(lang)}. </b>
                <Text id="rent.subtitle.4">
                  The first rents (including water, eletricity, gas, unlimited
                  wifi, housing insurance and maintenance) would be:
                </Text>
              </p>
              <p>{this.renderDetails([
                <span>
                  <Text id="rent.month" fields={{ month: firstMonths[0] }}>{firstMonths[0]}. rent:</Text>
                </span>,
                <b>{proratedRent / 100}€</b>,
                <span>
                  <Text id="rent.month" fields={{ month: firstMonths[1] }}>{firstMonths[1]}. rent:</Text>
                </span>,
                <b>{totalRent / 100}€</b>,
                <span>
                  <Text id="rent.month" fields={{ month: firstMonths[2] }}>{firstMonths[2]}. rent:</Text>
                </span>,
                <b>{totalRent / 100}€</b>,
                <i>etc.</i>,
                <b>{totalRent / 100}€</b>,
                <Text id="dueDate.title">Due date:</Text>,
                <Text id="dueDate.rent">
                  First rent is due 72h prior to your checkin and subsequent
                  rents are due on the first of the month.
                </Text>,
              ])}</p>
            </section>

            <section>
              <h4><Text id="deposit.title">Security deposit</Text></h4>
              <p>
                <Text id="deposit.subtitle">
                  The security deposit is 100% reimbursed at the end of your
                  stay if there are no fees to be withheld (damages,
                  overconsumption, etc.).
                </Text>
              </p>
              <p>{this.renderDetails([
                <Text id="amount">Amount:</Text>,
                <b>{DEPOSIT_PRICES[apartment.addressCity] / 100}€</b>,
                <Text id="dueDate.title">Due date:</Text>,
                <Text id="dueDate.checkIn">72h prior to your checkin.</Text>,
              ])}</p>
            </section>

            <section>
              <h4><Text id="lease.title">Personal lease</Text></h4>
              <p>
                <Text id="lease.subtitle">
                  After paying for the Housing Pack, you will be asked to provide
                  personal details and we will edit your personal customized lease
                  agreement
                </Text>
                &nbsp;(<a href={LEASE_SPECIMEN_URL} target="_blank">
                  <Text id="lease.link">specimen here</Text>
                </a>).
              </p>
            </section>

          </div>

          <div class="one-third">
            <section>
              <img src={room['cover picture']} alt="Picture of the room" width="100%" />
            </section>
            <section>
              <h4><Text id="acommodation.title">Accommodation details</Text></h4>
              <ul class={theme.unstyled}>
                <li>{room.name.split('-')[1]}</li>
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

const definition = {
  'en-US': {
    free: 'Free',
  },
  'fr-FR': {
    free: 'Gratuit',
    housingPack: {
      title: 'Pack Logement',
      subtitle: [
        'Vous avez choisi un pack logement ',
        ' ',
        '(à payer une seule fois quand vous réservez).',
      ],
      basic: 'basique',
      confort: 'comfort',
      privilege: 'privilège',
      description: `
        * Tant que votre pack logement n'est pas payé, la chambre reste
        disponible et peut être réservée par quelqu'un d'autre. De juillet à
        Octobre, nous vous recommandons de confirmer votre réservation rapidement
        car nous recevons des centaines de demandes de logement chaque semaine.
      `,
    },
    checkin: {
      subtitle: 'Pour votre checkin, plusieurs options s\'offrent à vous :',
      self: ['Self-service', '24/7 au distributeur de l\'agence'],
      home: ['À domicile', 'du lun. au ven. hors jours fériés de 9h à 18h'],
      special: 'À domicile 24/7',
      instructions: `
        Il vous sera demandé de remplir un formulaire pour indiquer votre option,
        date et heure de checkin, au moins 72h à l'avance.
      `,
      checkout: `
        Pour votre check-out, pas besoin de nous donner de date maintenant.
        Votre contrat est flexible et s'adapte à votre durée de séjour.
        Dès que vous savez à quelle date vous souhaitez partir, il vous suffit
        de prévenir notre équipe au moins 30 jours à l'avance !
      `,
    },
    rent: {
      title: 'Loyer mensuel',
      subtitle: [
        'Cette chambre est disponible',
        ' immédiatement ',
        ' à partir du ',
        'et le loyer commence le ',
        `Les premiers loyers (comprenant l'eau, l'électricité, le gaz,
        wifi illimitée, assurance habitation et maintenance) seraient :`,
      ],
      month: 'Loyer {{month}}.',
    },
    deposit: {
      title: 'Dépôt de garantie',
      subtitle: `
        Le dépôt de garantie est remboursé à 100% à la fin de votre séjour
        s'il n'y a pas de frais à retenir (dommages, surconsommation, etc.).
      `,
    },
    lease: {
      title: 'Bail individuel',
      subtitle: `
        Après avoir payé le Pack Logement, il vous sera demandé vos informations
        personnelles et nous éditerons votre bail individuel.
      `,
      link: 'specimen ici',
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
      checkIn: '72h avant votre checkin',
      rent: `
        Le premier loyer est dû 72h avant le checkin et les loyers suivants sont
        exigibles le premier du mois.
      `,
    },
  },
};

function mapStateToProps(args) {
  const { route, client, rooms, rentings, apartments, orders, booking } = args;
  const { lang, rentingId } = route;
  const renting = rentings[rentingId];
  const room = rooms[renting.RoomId];
  const totalRent = room['current price'] + room['service fees'];
  const packOrder = Utils.classifyRentingOrders({ rentingId, orders }).pack;
  const bookingDate = Utils.getBookingDate(room);
  const apartment = apartments[room.ApartmentId];

  return {
    lang,
    room,
    apartment,
    packLevel: booking.pack || packOrder && Utils.getPackLevel(packOrder),
    client,
    bookingDate,
    totalRent,
    proratedRent: Utils.prorateFirstRent(totalRent, bookingDate.getTime()),
    firstMonths: Utils.getFirstMonths(bookingDate),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
