import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider, Text } from 'preact-i18n';
// import { Link }               from 'preact-router/match';
import { Button }             from 'react-toolbox/lib/button';
import Utils                  from '~/utils';
import * as actions           from '~/actions';
import style                  from './style.css';

const BookingInfo = ({ lang, roomId, room }) => {
  const {
    availableAt,
    _currentPrice: currentPrice,
    _serviceFees: serviceFees,
    depositPrice,
  } = room;
  const priceLineClasses = `grid-4 has-gutter ${style.priceLine}`;

  return (
    <IntlProvider definition={definition[lang]}>
      <section className={style.bookingInfo}>
        <h3 className={style.subtitle}>
          <span><Text id="mensuel">Monthly Payments</Text></span>
        </h3>
        <div className={priceLineClasses}>
          <div className="one-half">
            <Text id="rent">Rent</Text>
          </div>
          <div className="one-half text-right">
            {currentPrice / 100}€/<Text id="month">month</Text>
          </div>
        </div>
        <div className={priceLineClasses}>
          <div className="one-half">
            <Text id="serviceFees">Service Fees</Text>
          </div>
          <div className="one-half text-right">
            {serviceFees / 100}€/<Text id="month">month</Text>
          </div>
        </div>
        <div className={`${priceLineClasses} ${style.cafHelp}`}>
          <div className="one-half">
            <Text id="caf">Rental assistance (CAF)</Text>
          </div>
          <div className="one-half text-right">
            -90€/<Text id="month">month</Text>
          </div>
        </div>
        <div className={style.cafNotice}>
          <Text id="cafInfo">
            This apartment is eligible for Rental Assistance (CAF). This aid is not
            systematic and its amount may change depending on the rent and
            your personal situation. Contact the CAF.
          </Text>
        </div>

        <h3 className={style.subtitle}><span>Paiements fixes</span></h3>
        <div className={priceLineClasses}>
          <div className="one-half">
            <Text id="deposit">Deposit</Text>
          </div>
          <div className="one-half text-right">
            {depositPrice / 100}€
          </div>
        </div>
        <div className={style.priceLineDesc}>
          <Text id="depositInfo">Reimbursed after your stay.</Text>
        </div>
        <div className={priceLineClasses}>
          <div className="one-half">
            <Text id="pack">Housing Pack</Text>
          </div>
          <div className="one-half text-right">
            -- €
          </div>
        </div>
        <div className={style.priceLineDesc}>
          <Text id="packInfo">
            Basic, Comfort or Privilege. Payment finalizes your reservation.
          </Text>
        </div>

        <h3 className={style.subtitle}>
          <span><Text id="included">Included</Text></span>
        </h3>

        <ul className={style.bookingFeatures}>
          <li>
            <i className="icon-24 picto-inclus_wifi" />
            <span><Text id="wifi">High-speed WiFi</Text></span>
          </li>
          <li>
            <i className="icon-24 picto-inclus_electricite" />
            <span><Text id="elec">Electricity</Text></span>
          </li>
          <li>
            <i className="icon-24 picto-inclus_eau" />
            <span><Text id="water">Water</Text></span>
          </li>
          <li>
            <i className="icon-24 picto-inclus_gaz" />
            <span><Text id="gaz">Gas</Text></span>
          </li>
          <li>
            <i className="icon-24 picto-inclus_assurance" />
            <span><Text id="insurance">Home insurance</Text></span>
          </li>
          <li>
            <i className="icon-24 picto-equipement_chambre_etage" />
            <span><Text id="condo">Co-property charges</Text></span>
          </li>
          <li>
            <i className="icon-24 picto-inclus_maintenance_technique" />
            <span><Text id="maintenance">Technical Maintenance</Text></span>
          </li>
          <li>
            <i className="icon-24 picto-inclus_taxe_ordures" />
            <span><Text id="waste">Household Waste Taxes</Text></span>
          </li>
        </ul>

        <p className={style.bookThisRoom}>
          <Button
            raised
            primary
            disabled={availableAt === null}
            href={`/${lang}/booking/${roomId}`}
            id="bookBtn"
            style="width: 100%"
          >
            <Text id="booking">Book this accommodation</Text>
          </Button>
        </p>

        <div className={style.buttonsDivide}>
          <div>
            <Button onClick={Utils.getVisitHandler(lang)}
              icon="local_see"
              raised
              disabled={availableAt === null}
              style="width: 100%"
            >
              <Text id="visit">Visit</Text>
            </Button>
          </div>
          <div>
            <Button onClick={Utils.getEnquireHandler(lang)}
              raised
              icon="question_answer"
              style="width: 100%"
            >
              <Text id="enquire">Enquire</Text>
            </Button>
          </div>
        </div>
      </section>
    </IntlProvider>
  );
};

const definition = { 'fr-FR': {
  mensuel: 'Paiements mensuels',
  rent: 'Loyer',
  month: 'mois',
  serviceFees: 'Charges',
  caf: 'Aide au logement (CAF)',
  cafInfo: `
    Ce logement est éligible aux APL. Le versement de cette aide n'est
    pas systématique et son montant, aléatoire, dépend du loyer et de
    votre situation personnelle. Contactez la CAF.
  `,
  deposit: 'Dépôt de garantie',
  depositInfo: 'Remboursé après votre séjour.',
  pack: 'Pack Logement',
  packInfo: 'Basique, Confort ou Privilège. Son paiement finalise votre réservation.',
  included: 'Inclus',
  wifi: 'Wifi haut débit illimité',
  elec: 'Électricité',
  water: 'Eau',
  gaz: 'Gaz',
  insurance: 'Assurance Habitation',
  condo: 'Charges de copropriété',
  maintenance: 'Maintenance technique',
  waste: 'Taxes sur les ordures',
  booking: 'Réserver ce logement',
  visit: 'Visite',
  enquire: 'Renseignements',
} };

function mapStateToProps({ route: { lang }, rooms }, { roomId }) {
  const room = rooms[roomId];

  return {
    room,
    lang,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingInfo);
