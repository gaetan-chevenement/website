import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider, Text } from 'preact-i18n';
// import { Link }               from 'preact-router/match';
import { Button }             from 'react-toolbox/lib/button';
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
          <span><Text id="manual">Paiement mensuels</Text></span>
        </h3>
        <div className={priceLineClasses}>
          <div className="one-half">
            <Text id="rent">Loyer</Text>
          </div>
          <div className="one-half text-right">
            {currentPrice / 100}€/<Text id="month">mois</Text>
          </div>
        </div>
        <div className={priceLineClasses}>
          <div className="one-half">
            <Text id="serviceFees">Charges</Text>
          </div>
          <div className="one-half text-right">
            {serviceFees / 100}€/<Text id="month">mois</Text>
          </div>
        </div>
        <div className={`${priceLineClasses} ${style.cafHelp}`}>
          <div className="one-half">
            <Text id="caf">Aide au logement (CAF)</Text>
          </div>
          <div className="one-half text-right">
            -90€/<Text id="month">mois</Text>
          </div>
        </div>
        <div className={style.cafNotice}>
          <Text id="cafInfo">
            Ce logement est éligible aux APL. Le versement de cette aide n'est
            pas systématique et son montant, aléatoire, dépend du loyer et de
            votre situation personnelle. Contactez la CAF.
          </Text>
        </div>

        <h3 className={style.subtitle}><span>Paiements fixes</span></h3>
        <div className={priceLineClasses}>
          <div className="one-half">
            <Text id="deposit">Dépôt de garantie</Text>
          </div>
          <div className="one-half text-right">
            {depositPrice / 100}€
          </div>
        </div>
        <div className={style.priceLineDesc}>
          <Text id="depositInfo">Remboursé après votre séjour.</Text>
        </div>
        <div className={priceLineClasses}>
          <div className="one-half">
            <Text id="pack">Pack Logement</Text>
          </div>
          <div className="one-half text-right">
            -- €
          </div>
        </div>
        <div className={style.priceLineDesc}>
          <Text id="packInfo">
            Basique, Confort ou Privilège, à choisir à la réservation
          </Text>
        </div>

        <h3 className={style.subtitle}>
          <span><Text id="included">Inclus</Text></span>
        </h3>

        <ul className={style.bookingFeatures}>
          <li>
            <i className="icon-24 picto-inclus_wifi" />
            <span><Text id="wifi">Wifi haut débit illimité</Text></span>
          </li>
          <li>
            <i className="icon-24 picto-inclus_electricite" />
            <span><Text id="elec">Électricité</Text></span>
          </li>
          <li>
            <i className="icon-24 picto-inclus_eau" />
            <span><Text id="water">Eau</Text></span>
          </li>
          <li>
            <i className="icon-24 picto-inclus_gaz" />
            <span><Text id="gaz">Gaz</Text></span>
          </li>
          <li>
            <i className="icon-24 picto-inclus_assurance" />
            <span><Text id="insurance">Assurance habitation</Text></span>
          </li>
          <li>
            <i className="icon-24 picto-inclus_maintenance_technique" />
            <span><Text id="condo">Charges de copropriété</Text></span>
          </li>
          <li>
            <i className="icon-24 picto-inclus_maintenance_technique" />
            <span><Text id="maintenance">Maintenance technique</Text></span>
          </li>
          <li>
            <i className="icon-24 picto-inclus_taxe_ordures" />
            <span><Text id="waste">Taxes sur les ordures</Text></span>
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
            <Text id="booking">Réserver ce logement</Text>
          </Button>
        </p>

        <div className={style.buttonsDivide}>
          <div>
            <Button icon="local_see"
              raised
              disabled={availableAt === null}
              style="width: 100%"
            >
              <span><Text id="visit">Visiter</Text></span>
            </Button>
          </div>
          <div>
            <Button raised icon="question_answer" style="width: 100%">
              <span><Text id="enquire">Demande d'info</Text></span>
            </Button>
          </div>
        </div>
      </section>
    </IntlProvider>
  );
};

const definition = { 'fr-FR': {

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
