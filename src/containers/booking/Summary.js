import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import autobind               from 'autobind-decorator';
import capitalize             from 'lodash/capitalize';
import { Checkbox }           from 'react-toolbox/lib/checkbox';
import { Button }             from 'react-toolbox/lib/button';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import _const                 from '~/const';
import theme                  from './theme';

const _ = { capitalize };
const {
  ELIGIBILITY_FORM_URL,
  DEPOSIT_PRICES,
  HOME_CHECKIN_FEES,
  SPECIAL_CHECKIN_FEES,
} = _const;


class Summary extends PureComponent {
  @autobind
  handleChange(value, event) {
    const { actions } = this.props;

    batch(
      actions.updateSummary({ [event.target.name]: value }),
      actions.deleteSummaryError(event.target.name)
    );
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
  render(args) {
    const {
      lang,
      room,
      apartment,
      packLevel,
      packPrice,
      client: {
        firstName,
        lastName,
        email,
      },
      bookingDate,
      totalRent,
      proratedRent,
      firstMonths,
      weekdays: [
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      ],
      summary: { check0, check1, check2, check3, check4 },
    } = args;
    const homeCheckinFee = HOME_CHECKIN_FEES[packLevel];
    const specialCheckinFee = SPECIAL_CHECKIN_FEES[packLevel];
    const free = (<Text id="free">Free</Text>);

    return (
      <IntlProvider definition={definition[lang]}>
        <div class="grid has-gutter-xl">
          <div class="two-thirds">
            <section>
              <h4>1. <Text id="housingPack.title">Housing Pack</Text></h4>
              <p>
                <Text id="housingPack.subtitle.0">You have selected the </Text>
                <b>
                  <Text id={`housingPack.${packLevel}`}>{packLevel}</Text>
                  <Text id="housingPack.subtitle.1"> housing-pack </Text>
                </b>
                <Text id="housingPack.subtitle.2">, to be paid in order to validate your booking.</Text>
              </p>
              <p>{this.renderDetails([
                <Text id="payment">Payment:</Text>,
                <span>
                  <b>{packPrice / 100}€</b>
                  <Text id="housingPack.dueDate"> to pay immediatly (only once) </Text>
                </span>,
              ])}</p>
              <p class="text-small">
                <i class="text-small material-icons">warning</i>
                <Text id="housingPack.condition">
                  Please note: this bedroom remains available and can be booked
                  by someone else at any point as long as the Housing Pack is
                  not paid.
                </Text>
              </p>
            </section>

            <section>
              <h4>2. <Text id="rent.title">Monthly Rent</Text></h4>
              <p>
                <b>
                  <Text id="rent.subtitle.0">Your rent will begin on the</Text>
                  {' '}{bookingDate.toLocaleDateString(lang)}{' '}
                </b>
                <Text id="rent.subtitle.1">
                  (date of availability of the room), regardless of your
                  moving-in date. Your rent, all charges and utilities included
                  (internet, water, gas, electricity, insurance, etc.), will
                  come to:
                </Text>
              </p>
              <p>{this.renderDetails([
                <span>
                  { Utils.formatMonth(bookingDate, { lang }) }
                </span>,
                <span>
                  <b>{proratedRent / 100}€ </b>
                  <Text id="rent.dueDate" />
                  <b> { Utils.formatDate(bookingDate, { lang }) }</b>,
                </span>,
                <span>
                  { Utils.formatMonth(firstMonths[1], { lang }) }
                </span>,
                <span>
                  <b>{totalRent / 100}€ </b>
                  <Text id="rent.dueDate" />
                  <b> { Utils.formatDate(firstMonths[1], { lang }) }</b>,
                </span>,
                <span>
                  { Utils.formatMonth(firstMonths[2], { lang }) }
                </span>,
                <span>
                  <b>{totalRent / 100}€ </b>
                  <Text id="rent.dueDate" />
                  <b> { Utils.formatDate(firstMonths[2], { lang }) }</b>
                </span>,
                <i>etc.</i>,
              ])}</p>

              <p class="text-small">
                <i class="text-small material-icons">warning</i>
                <Text id="rent.condition.0"> Please note: </Text>
                <ul>
                  <li>
                    <Text id="rent.condition.1">
                      These amounts of rent are only valid if you finalise your
                      booking immediately by paying for your housing pack. They
                      are otherwise susceptible to increase depending on the
                      offer and the amount of demand we are currently
                      experiencing.
                    </Text>
                  </li>
                  <li>
                    <Text id="rent.condition.2">
                      A late payment fee of 10€ a day is automatically applied
                      if the payment deadline is missed.
                    </Text>
                  </li>
                  <li>
                    <Text id="rent.condition.3">
                      If you are two to live in this bedrorom, 90€ will be
                      added on to the monthly rent. Before booking, please
                      check with our team via hello@chez-nestor.com to check
                      if this particular bedroom is fit for two people.
                    </Text>
                  </li>

                </ul>
              </p>
            </section>

            <section>
              <h4>3. <Text id="deposit.title">Security deposit</Text></h4>
              <p>
                <Text id="deposit.subtitle">
                  The security deposit is reimbursed in full at the end of your
                  stay if there are no deductions to be made (damages,
                  overconsumption, etc.).
                </Text>
              </p>
              <p>{this.renderDetails([
                <Text id="payment">Payment:</Text>,
                <span>
                  <b>{DEPOSIT_PRICES[apartment.addressCity] / 100}€ </b>
                  <Text id="deposit.dueDate">to be paid before your check-in (only once)</Text>
                </span>,
              ])}</p>
            </section>

            <section>
              <h4>4. <Text id="checkin.title">Check-in steps</Text></h4>
              <p>
                <Text id="checkin.subtitle">
                  Your keys can be picked up once these 5 following steps are
                  completed online at least one full working day ahead
                  (monday to friday, bank holidays excluded):
                </Text>
                <ol>
                  <li>
                    <Text id="checkin.option.0">
                      Your identity record is filled in (and tenancy file if necessary).
                    </Text>
                  </li>
                  <li>
                    <Text id="checkin.option.1">
                      Your prefered check–in date and time has been registered.
                    </Text>
                  </li>
                  <li>
                    <Text id="checkin.option.2">
                      Your lease has been signed online by you
                      (and by your guarantor, if necessary)
                    </Text>
                  </li>
                  <li>
                    <Text id="checkin.option.3">
                      Your security deposit has been paid.
                    </Text>
                  </li>
                  <li>
                    <Text id="checkin.option.4">
                      Your 1st month’s rent has been paid.
                    </Text>
                  </li>
                </ol>
              </p>

              <p class="text-small">
                <i class="text-small material-icons">warning</i>
                <Text id="checkin.condition"> Please note: </Text>
                <ul>
                  <li>
                    <Text id="checkin.delay" fields={{ checkin: tuesday, before: monday }} />
                  </li>
                  <li>
                    <Text id="checkin.delay" fields={{ checkin: wednesday, before: tuesday }} />
                  </li>
                  <li>
                    <Text id="checkin.delay" fields={{ checkin: thursday, before: wednesday }} />
                  </li>
                  <li>
                    <Text id="checkin.delay" fields={{ checkin: friday, before: thursday }} />
                  </li>
                  <li>
                    <Text id="checkin.delay" fields={{ checkin: `${saturday}, ${sunday} or ${monday}`, before: friday }} />
                  </li>
                </ul>
              </p>
            </section>

            <section>
              <h4>5. <Text id="checkin.goThrough">Go through check-in</Text></h4>
              <p>
                <Text id="checkin.options">
                  For your check-in, several options are available to you:
                </Text>
                <ul>
                  <li>
                    <b><Text id="checkin.self.0">Self-service</Text> </b>
                    <Text id="checkin.self.1">any day/time (24/7) at the agency's key safes</Text> -
                    <b> {free}</b>
                  </li>
                  <li>
                    <b><Text id="checkin.home.0">At home</Text> </b>
                    <Text id="checkin.home.1">Monday to Friday from 9am to 6pm (bank holidays excluded)</Text> -
                    <b> {homeCheckinFee ? `${homeCheckinFee / 100}€` : free}</b>
                  </li>
                  <li>
                    <b><Text id="checkin.special">At home 24/7</Text> </b> -
                    <b> {specialCheckinFee ? `${specialCheckinFee / 100}€` : free}</b>
                  </li>
                </ul>
              </p>
            </section>

            <section>
              <h4>6. <Text id="checkout.title">Planning your checkout</Text></h4>
              <p>
                <Text id="checkout.subtitle">
                  No need for us to know now when you are planning to move out,
                  we are very flexible! Just keep in mind that you will need
                  to notify us at least 30 days before you move out.
                </Text>
              </p>
            </section>

            <section>
              <h4><Text id="letsGo.title">Let's get started!</Text></h4>
              <p>
                <Text id="letsGo.subtitle.0">
                  Before booking, you need to ensure you are eligibile for
                  accommodation with Chez Nestor:&nbsp;
                </Text>
                <Button raised
                  icon="launch"
                  href={ELIGIBILITY_FORM_URL}
                  target="_blank"
                >
                  <Text id="letsGo.subtitle.1">Test your eligibility</Text>
                </Button>
              </p>
              <p>
                <Checkbox
                  name="check0"
                  checked={check0}
                  onChange={this.handleChange}
                  theme={theme}
                >
                  {' '}
                  <Text id="letsGo.checks.0">
                     I confirm that I am eligible, and that I am able to
                     provide all the required documents.
                  </Text>
                </Checkbox>
              </p>

              <p>
                <Checkbox
                  name="check1"
                  checked={check1}
                  onChange={this.handleChange}
                  theme={theme}
                >
                  {' '}
                  <Text id="letsGo.checks.1">
                    I want my booking to come into effect immediately,
                    processed administratively and that the room be officially
                    blocked under my name. Thus, I expressly renounce my right
                    to withdraw, so that the service begins before the end of
                    the legal withdrawal period, in accordance with Article
                    L121-21-8 of the Code de la Consommation
                  </Text>
                </Checkbox>
              </p>

              <p>
                <Checkbox
                  name="check2"
                  checked={check2}
                  onChange={this.handleChange}
                  theme={theme}
                >
                  {' '}
                  <Text id="letsGo.checks.2">
                    I have understood that my rent as well as all future
                    payments will start from the
                  </Text>
                  {' '}
                  { Utils.formatDate(bookingDate, { lang }) }.
                </Checkbox>
              </p>

              <p>
                <Checkbox
                  name="check3"
                  checked={check3}
                  onChange={this.handleChange}
                  theme={theme}
                >
                  {' '}
                  <Text id="letsGo.checks.3">
                    I have read and agreed to the terms and conditions stated
                    in the&nbsp;
                  </Text>
                  <a href="https://drive.google.com/file/d/1J3CI5S-rudYMpc1dKz5cSjwb0zY2X4cy/view?usp=sharing">
                    <Text id="letsGo.checks.4">tenancy agreement</Text>
                  </a>.
                </Checkbox>
              </p>

              <p>
                <Checkbox
                  name="check4"
                  checked={check4}
                  onChange={this.handleChange}
                  theme={theme}
                >
                  {' '}
                  <Text id="letsGo.checks.5">
                    I confirm that I have read and accepted the&nbsp;
                  </Text>
                  <a href="https://drive.google.com/file/d/0B8dLiyBmm3wJa1IwbWsxbk85LWs/view">
                    <Text id="letsGo.checks.6">general terms and conditions</Text>
                  </a>.
                </Checkbox>
              </p>
            </section>
          </div>

          <div class="one-third">
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
    rent: {
      dueDate: 'to be paid at the latest on the',
    },
    checkin: {
      delay: 'To move in {{checkin}}, everything must be done before {{before}} midday.',
    },
  },
  'fr-FR': {
    free: 'Gratuit',
    payment: 'Paiement',
    housingPack: {
      title: 'Pack Logement',
      subtitle: [
        'Vous avez choisi un pack logement ',
        ' ',
        ', à payer pour valider votre réservation.',
      ],
      basic: 'basique',
      comfort: 'confort',
      privilege: 'privilège',
      dueDate: ' à payer immédatement (uns seule fois)',
      condition: `
        À noter : la chambre reste disponible et peut être réservée par
        quelqu’un d’autre à tout moment, tant que votre Pack Logement n’est
        pas payé.
      `,
    },
    rent: {
      title: 'Loyer mensuel',
      subtitle: [
        'Votre loyer commencera le',
        `(date de disponibilité de la chambre), quelque soit votre date
        d’emménagement. Vos loyers charges incluses (wifi, eau, électricité,
        gaz, assurance…) seront :`,
      ],
      dueDate: 'à payer au plus tard le',
      condition: [
        ' À noter :',
        `Ces loyers sont valables uniquement si vous finalisez votre
        réservation immédiatement en payant votre Pack Logement. Sinon, les
        loyers sont susceptibles d’évoluer selon l’offre et la demande.`,
        `En cas de retard de paiement de vos loyers, une pénalité automatique
        de 10€/jour s’applique`,
        `Si vous êtes deux (ex : couple) à occuper cette chambre,
        90€/mois s’ajoutent au loyer. Avant de réserver, contactez notre
        équipe via hello@chez-nestor.com pour vérifier la possibilité
        d’emménager à deux. Autrement, votre réservation pourrait être annulée.`,
      ],
    },
    deposit: {
      title: 'Dépôt de garantie',
      subtitle: `
        Le dépôt de garantie est remboursé à 100% après votre séjour, si aucun
        frais n’est à retenir (dommages, surconsommations…).
      `,
      dueDate: 'à payer avant votre checkin (une seule fois)',
    },
    checkin: {
      title: 'Étapes du checkin',
      subtitle: `
        Pour récupérer vos clés, effectuez les 5 actions suivantes, en ligne,
        au minimum 1 jour ouvré à l’avance (lundi à vendredi, jours fériés exclus) :
      `,
      option: [
        'Votre formulaire d’identité (et dossier, si nécessaire) est rempli.',
        'Votre formulaire de check-in (choix des date et heure) est rempli.',
        'Votre bail est signé (et par votre garant, si nécessaire).',
        'Votre dépôt de garantie est payé.',
        'Votre 1er loyer est payé.',
      ],
      condition: ' À noter :',
      delay: 'Pour emménager {{checkin}}, tout doit être prêt avant {{before}} midi.',
      goThrough: 'Réaliser mon checkin',
      options: `
        Trois options sont disponibles pour votre check-in (récupérer vos clés) :
      `,
      self: ['Self-service', '24/7 au distributeur de l\'agence'],
      home: ['À domicile', 'du lundi au vendredi hors jours fériés de 9h à 18h'],
      special: 'À domicile 24/7',
    },
    checkout: {
      title: 'Planifier le checkout',
      subtitle: `
        Pas besoin de nous dire aujourd’hui quand vous partirez, vous êtes
         totalement flexible ! Gardez simplement en tête qu’il faudra nous
         donner votre date de départ au moins 30 jours à l’avance.
      `,
    },
    letsGo: {
      title: 'C\'est parti !',
      subtitle: [`
        Avant de réserver, vous devez vous assurer que vous êtes admissible à
        un logement Chez Nestor :
      `,`
        Tester mon éligibilité
      `],
      checks: [`
        Je confirme que je suis admissible, et que je peux fournir tous les
        documents requis.
      `,`
        Je souhaite que ma réservation prenne effet immédiatement ,
        qu’elle soit traitée administrativement et que la chambre soit bloquée
        à mon nom. Ainsi, je renonce expressément à mon droit de rétractation,
        afin que la prestation débute avant la fin du délai légal de
        rétractation, conformément à l'article L121-21-8 du Code de la
        Consommation.
      `, `
        J’ai bien compris que mes loyers et leur paiement commenceront à partir
        du
      `, `
        J’ai lu et j’accepte les conditions de mon
      `, `
        bail d'habitation
      `, `
        J’ai lu et j’accepte les
      `, `
        conditions générales de vente
      `],
    },
    'es-ES': {
      free: 'Gratuito',
      payment: 'Pago',
      housingPack: {
        title: 'Housing Pack',
        subtitle: [
          'Usted ha elegido un Housing Pack ',
          ' ',
          ', deberá ser pagado para validar su reserva.',
        ],
        basic: 'básico',
        comfort: 'comfort',
        privilege: 'privilegio',
        dueDate: ' pagar inmediatamente (sólo una vez)',
        condition: `
          Nota: la habitación permanece disponible y puede ser reservada por
          cualquier otra persona en todo momento, en tanto no se haya procedido al pago de su Housing Pack.
        `,
      },
      rent: {
        title: 'renta mensual',
        subtitle: [
          'Su alquiler comenzará el',
          `(fecha de disponibilidad de la habitación), cualquiera que sea tu fecha de mudanza. El pago de sus alquileres, gastos incluidos (wifi, agua, electricidad),
          Gasolina, seguros...) deberá realizarse..:`,
        ],
        dueDate: 'a más tardar el',
        condition: [
          ' Por favor, tenga en cuenta que:',
          `Estos alquileres sólo son válidos si usted finaliza su
          reserva inmediatamente pagando su Housing Pack. En caso contrario,
          los alquileres están sujetos a cambios en función de la oferta y la demanda`,
          `En caso de retraso del pago de sus alquileres, se aplica una penalización automática de 10€/día`,
          `Si son dos (ej: pareja) a ocupar esta habitación,
          90€/mes se añaden al alquiler. Antes de reservar, póngase en contacto con nuestro equipo
          a través de hello@chez-nestor.com para comprobar la posibilidad de mudarse con otra persona. 
          Si no lo hace, su reserva podría ser cancelada.`,
        ],
      },
      deposit: {
        title: 'Depósito de seguridad',
        subtitle: `
         El depósito es 100% reembolsable después de su estancia,
           si no es necesario retener ningún gasto (daños, consumo excesivo...).
        `,
        dueDate: 'a pagar antes de su checkin (una sola vez)',
      },
      checkin: {
        title: 'Etapas del checkin',
        subtitle: `
          Para recoger sus llaves, realice las 5 siguientes acciones, en línea,
          con un mínimo de 1 día laborable de antelación
          (de lunes a viernes, excluidos los días feriados) :`,
        option: [
          'Su formulario de identidad (y archivo, si es necesario) está rellenado.',
          'Su formulario de mudanza (elección de la fecha y de la hora) está rellenado.',
          'Su contrato de arrendamiento está firmado (y por su garante, si es necesario).',
          'Su depósito de seguridad está pagado.',
          'Su primer alquiler está pagado.',
        ],
        condition: ' Por favor, tenga en cuenta que:',
        delay: 'Para mudarse, {{checkin}},  todo debe estar listo antes {{before}} del mediodía.',
        goThrough: 'Realizar mi checkin',
        options: `
          Hay tres opciones disponibles para su check-in (entrega de llaves) :
        `,
        self: ['Autoservicio, 24 horas al día, todos los días de la semana en el distribuidor de la agencia'],
        home: ['A domicilio', 'de lunes a viernes salvo días festivos de las 9 a las 18 horas'],
        special: 'A domicilio 24/7',
      },
      checkout: {
        title: 'Planear el checkout',
        subtitle: `
          No es necesario decirnos hoy, cuando te vayas, tu eres totalmente flexible! Sólo ten en cuenta que vamos a necesitar tu fecha de salida con una antelacion mínima de 30 días.
        `,
      },
      letsGo: {
        title: '¡Vamos!',
        subtitle: [`
          Antes de reservar, debes asegurarte que es elegible para
          un alojamiento Chez Nestor :
        `,`
         Comprobar mi elegibilidad
        `],
        checks: [`
        Confirmo que cumplo con los requisitos y que soy capaz de proporcionar todos los
          documentos requeridos.
        `,`
          Quiero que mi reserva sea válida inmediatamente,
          que sea tratada administrativamente y que la habitación sea bloqueada
          en mi nombre. Así, renuncio expresamente a mi derecho de retractación,
          para que el servicio comienza antes de que finalice el plazo legal de retractación,
          de conformidad con el artículo L121-21-8 del Código de
          Consumo.
        `, `
          Entiendo que mis alquileres y su pago comenzarán a partir de
          del
        `, `
          He leído y acepto los términos de mi
        `, `
          contrato de alquiler de vivienda
        `, `
          He leído y acepto las
        `, `
          condiciones generales de venta
        `],
      },
    },
  },
};

function mapStateToProps(args) {
  const {
    route,
    client,
    rooms,
    rentings,
    apartments,
    orders,
    booking,
    summary,
  } = args;
  const { lang, rentingId } = route;
  const renting = rentings[rentingId];
  const room = rooms[renting.RoomId];
  const totalRent = room._currentPrice + room._serviceFees;
  const packOrder = Utils.classifyRentingOrders({ rentingId, orders }).pack;
  const bookingDate = Utils.getBookingDate(room);
  const apartment = apartments[room.ApartmentId];

  return {
    lang,
    room: { ...room, name: Utils.localizeRoomName(room.name, lang) },
    apartment,
    packLevel: packOrder && Utils.getPackLevel(packOrder) || booking.pack,
    packPrice: packOrder.amount,
    client,
    bookingDate,
    totalRent,
    proratedRent: Utils.prorateFirstRent(totalRent, bookingDate),
    firstMonths: Utils.getFirstMonths(bookingDate),
    weekdays: Utils.getWeekdays(lang),
    summary,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
