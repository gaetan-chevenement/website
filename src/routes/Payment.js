import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { route }              from 'preact-router';
import autobind               from 'autobind-decorator';
import Promise                from 'bluebird';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { Button }             from 'react-toolbox/lib/button';
import OrderDetails           from '~/containers/payment/OrderDetails';
import CardForm               from '~/containers/payment/CardForm';
import * as actions           from '~/actions';
import Utils                  from '~/utils';


class Payment extends PureComponent {
  @autobind
  handleSubmitPayment() {
    const { returnUrl, payment, actions, lang, orderId } = this.props;

    return Promise.resolve()
      .then(() => actions.validatePayment(payment))
      .then(() => actions.savePayment(payment))
      .then(() => actions.getOrder(orderId))
      .then(() => {
        if ( !returnUrl ) {
          return;
        }
        route(returnUrl);
      })
      .catch(console.error);
  }
  componentWillMount() {
    const { orderId, orderLabel, actions } = this.props;

    if ( orderLabel === undefined ) {
      actions.getOrder( orderId );
    }
  }
  render() {
    const {
      lang,
      orderId,
      orderLabel,
      orderBalance,
      payment,
      payment: { errors },
      isOrderLoading,
    } = this.props;
    if ( isOrderLoading ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div class="content">
          <h1>
            <Text id="title">Secure payment for order of</Text><br />
            <em>{orderLabel}</em>
          </h1>

          <section>
            <OrderDetails orderId={orderId} />
          </section>
          <section>
          { !payment.isValidated && !errors.payment && orderBalance !== 0 ?
            <h3>
              <Text id='payment.title'>Payment can be made by Mastercard or Visa.</Text>
            </h3>
          : '' }
            <CardForm />
          </section>

          { !payment.isValidated && !errors.payment && orderBalance !== 0?
          <nav class="text-center">
            { payment.isValidating || payment.isSaving ?
              <ProgressBar type="circular" mode="indeterminate" /> :
              <section style="margin-top: 2rem;">
                <Button raised primary
                  disabled={!payment.cardNumber || !payment.cvv || !payment.expiryMonth
                    || !payment.expiryYear || !payment.holderName}
                  label={ <Text id='payment.button'>Pay Now</Text> }
                  icon="payment"
                  onClick={this.handleSubmitPayment}
                />
              </section>
            }
          </nav>
          : '' }

        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  title: 'Paiement sécurisé pour la facture de',
  payment: {
    title: 'Le Paiement peut s\'effectuer avec une carte Mastercard ou Visa.',
    button: 'payer',
  },
} };

function mapStateToProps({ route: { lang, returnUrl }, orders, payment }) {
  const { orderId } = payment;
  const order = orders[orderId];

  return {
    lang,
    returnUrl,
    orderId,
    payment,
    orderBalance: order && order.balance,
    orderLabel: order && order.label,
    isOrderLoading: order === undefined || order.isLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
