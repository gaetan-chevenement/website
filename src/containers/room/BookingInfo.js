import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import * as actions           from '~/actions';

import style from './style.css';

class BookingInfo extends PureComponent {
  render() {
    const { lang } = this.props;
    const priceLineClasses = ['grid-4', 'has-gutter', style.priceLine].join(' ')
    return (
      <IntlProvider definition={definition[lang]}>
        <section className={style.bookingInfo}>
          <h3 className={style.subtitle}><span>Paiement mensuels</span></h3>
          <div className={priceLineClasses}>
            <div className="one-half">
              Loyer
            </div>
            <div className="one-half text-right">
              668€/mois
            </div>
          </div>
          <div className={priceLineClasses}>
            <div className="one-half">
              Charges
            </div>
            <div className="one-half text-right">
              30€/mois
            </div>
          </div>
          <div className={priceLineClasses + ' ' + style.cafHelp}>
            <div className="one-half">
              Aide au logement (CAF)
            </div>
            <div className="one-half text-right">
              - 90€/mois
            </div>
          </div>
          <div className={style.cafNotice}>
            Ce logement est éligible aux APL. Le versement de cette aide n'est
            pas systématique et son montant, aléatoire, dépend du loyer et de votre
            situation personnelle. Contactez la CAF.
          </div>


          <h3 className={style.subtitle}><span>Paiements fixes</span></h3>
          <div className={priceLineClasses}>
            <div className="one-half">
              Dépôt de garantie
            </div>
            <div className="one-half text-right">
              690€
            </div>
          </div>
          <div className={style.priceLineDesc}>
            Remboursé après votre séjour.
          </div>
          <div className={priceLineClasses}>
            <div className="one-half">
              Pack Logement
            </div>
            <div className="one-half text-right">
              -- €
            </div>
          </div>
          <div className={style.priceLineDesc}>
            Basique, Confort ou Privilège, à choisir à la réservation.
          </div>

          <h3 className={style.subtitle}><span>Inclus</span></h3>

          <ul className={style.bookingFeatures}>
            <li>
              <i className="picto-inclus_wifi" />
              <span>Wifi haut débit illimité</span>
            </li>
            <li>
              <i className="picto-inclus_electricite" />
              <span>Electricité</span>
            </li>
            <li>
              <i className="picto-inclus_eau" />
              <span>Eau</span>
            </li>
            <li>
              <i className="picto-inclus_gaz" />
              <span>Gaz</span>
            </li>
            <li>
              <i className="picto-inclus_assurance" />
              <span>Assurance habitation</span>
            </li>
            <li>
              <i className="picto-inclus_maintenance_technique" />
              <span>Charges de copropriété</span>
            </li>
            <li>
              <i className="picto-inclus_maintenance_technique" />
              <span>Maintenance technique</span>
            </li>
            <li>
              <i className="picto-inclus_taxe_ordures" />
              <span>Taxes sur les ordures</span>
            </li>
          </ul>

          <div className={style.bookThisRoom}>
            <a>Réserver ce logement</a>
          </div>

          <div className="grid-2 has-gutter">
            <div className="one-half">
              <div className={style.btnWhite}>
                <i class="picto-bouton_visite" />
                <span>Visiter</span>
              </div>
            </div>
            <div className="one-half">
              <div className={style.btnWhite}>
                <i class="picto-r" />
                <span>Demander</span>
              </div>
            </div>
          </div>
        </section>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {} };

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];

  return {
    room,
    lang
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingInfo);
