import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { Button }             from 'react-toolbox/lib/button';
import { batch }              from 'redux-act';
import { IntlProvider, Text } from 'preact-i18n';
import autobind               from 'autobind-decorator';
import { Input }              from 'react-toolbox/lib/input';
import * as actions           from '~/actions';
import Utils                  from '~/utils';
import { API_BASE_URL }       from '~/const';

class CardForm extends PureComponent {
  @autobind
  handleChange(value, event) {
    const { actions } = this.props;
    batch(
      actions.updatePayment({ [event.target.name]: value }),
      actions.deletePaymentError(event.target.name)
    );
  }

  @autobind
  deletePaymentError() {
    const { actions } = this.props;
    batch(
      actions.deletePaymentError('payment'),
      actions.updatePayment({
        cardNumber: '',
        holderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
      }),
    );
  }

  render() {
    const {
      lang,
      orderId,
      payment: { errors },
      orderBalance,
      orderStatus,
      receiptNumber,
      payment,
      currYear,
    } = this.props;

    if (!payment.isValidated && orderBalance >= 0) {
      return (
        <IntlProvider definition={definition[lang]}>
          <section>
            <div class="handleError">
              <h4>
                <Text id="errors.paid">This order has already been paid.</Text>
              </h4>
              <br />
              <InvoiceButton {...{ lang, orderId, receiptNumber }} />
            </div>

          </section>
        </IntlProvider>
      );
    }
    if ( payment.isValidated ) {
      return (
        <IntlProvider definition={definition[lang]}>
          <div class="text-center">
            <h3>
              <Text id="payment.ok.first">Your payment has been approved.</Text>
              <br />
              <Text id="payment.ok.second">The Chez Nestor Team would like to wish you a great day!</Text>
            </h3>
            <br />
            <InvoiceButton {...{ lang, orderId, receiptNumber }} />
          </div>
        </IntlProvider>
      );
    }

    if ( errors.payment || orderStatus === 'cancelled' ) {
      return (
        <IntlProvider definition={definition[lang]}>
          <section>
            <div class="handleError">
              { orderStatus === 'cancelled' ? (
                <h4>
                  <Text id="order.cancelled">This order has been cancelled.</Text>
                </h4>
              ) : '' }

              { errors.payment.hasWrongBalance ? (
                <div>
                  <h4>
                    <Text id="errors.paid">This order has already been paid.</Text>
                  </h4>
                  <br />
                  <InvoiceButton {...{ lang, orderId, receiptNumber }} />
                </div>
              ) : '' }

              { errors.payment.hasNoOrder ? (
                <h4>
                  <Text id="errors.noOrder.first">We cannot retrieve this order.</Text><br />
                  <Text id="errors.noOrder.second">Please contact the Chez Nestor Support Team.</Text>
                </h4>
              ) : '' }

              { errors.payment.isBooked ? (
                <h4>
                  <Text id="errors.isBooked">This room has been booked by someone else.</Text>
                </h4>
              ) : '' }

              { errors.payment.unexpected ? (
                <div>
                  <h4>
                    <Text id="errors.unexpected">An unexpected error has occured.</Text><br />
                    { errors.payment.unexpected }
                  </h4>
                  <Button
                    raised
                    primary
                    label={<Text id="errors.tryAgain">Try Again</Text>}
                    onClick={this.deletePaymentError}
                  />
                </div>
              ) : '' }
            </div>
          </section>
        </IntlProvider>
      );
    }
    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <section>
            <Input type="number"
              label={<Text id="card.number">Card Number</Text>}
              name="cardNumber"
              value={payment.cardNumber}
              onChange={this.handleChange}
              error={errors.cardNumber}
            />
            <Input type="text"
              label={<Text id="card.holder">Holder Name</Text>}
              name="holderName"
              value={payment.holderName}
              onChange={this.handleChange}
              error={errors.holderName}
            />
            <p class="grid-3-large-1 has-gutter">
              <Input type="number" min="1" max="12" step="1" maxLength="2"
                label={<Text id="card.expiry.month">Expiry Month</Text>}
                name="expiryMonth"
                value={payment.expiryMonth}
                onChange={this.handleChange}
                error={errors.expiryMonth}
              />
              <Input type="number" min={currYear} max={currYear + 10} step="1" maxLength="2"
                label={<Text id="card.expiry.year">Expiry Year</Text>}
                name="expiryYear"
                value={payment.expiryYear}
                onChange={this.handleChange}
                error={errors.expiryYear}
              />
              <Input type="number" min="0" max="999" step="1" maxLength="3"
                label={<Text id="card.cvv">CVV</Text>}
                name="cvv"
                value={payment.cvv}
                onChange={this.handleChange}
                error={errors.cvv}
              />
            </p>
          </section>
        </div>
      </IntlProvider>
    );
  }
}

function InvoiceButton({ lang, orderId, receiptNumber }) {
  const url = `${API_BASE_URL}/actions/pdf-invoice/invoice-${receiptNumber}.pdf`;
  const params = `orderId=${orderId}&lang=${lang}`;

  return (
    <IntlProvider definition={definition[lang]}>
      <Button raised primary
        label={<Text id="downloadInvoice">Download your invoice</Text>}
        href={`${url}?${params}`}
        target="_blank"
      />
    </IntlProvider>
  );
}

function mapStateToProps({ route: { lang }, orders, payment }) {
  const { orderId } = payment;
  const order = orders[orderId];

  return {
    lang,
    payment,
    orderId: order && order.id,
    orderBalance: order && order.balance,
    receiptNumber: order && order.receiptNumber,
    orderStatus: order && order.status,
    currYear: Utils.getCurrYear(),
  };
}

const definition = { 'fr-FR': {
  errors: {
    paid: 'Cette facture a déjà été payée',
    noOrder: {
      first: 'Nous ne parvenons pas à retrouver cette facture.',
      second: 'Veuillez contacter l\'équipe Chez Nestor.',
    },
    isBooked: 'Cette chambre a été réservée par un autre client.',
    unexpected: 'Une erreur est survenue.',
    tryAgain: 'Réessayer',
  },
  payment: {
    ok: {
      first: 'votre paiement a été validé.',
      second: 'l\'équipe Chez Nestor vous souhaite une excellente journée',
    },
  },
  card: {
    number: 'Numéro de carte bleue',
    holder: 'titulaire de la carte bleue',
    expiry: {
      month: 'mois d\'expiration',
      year: 'année d\'expiration',
    },
    cvv: 'cryptogramme',
  },
  downloadInvoice: 'Télécharger votre facture',
  order: {
    cancelled: 'Cette facture a été annulée',
  },
} };

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CardForm);
