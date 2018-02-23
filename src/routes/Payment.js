import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { route }              from 'preact-router';
import autobind               from 'autobind-decorator';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { Button }             from 'react-toolbox/lib/button';
import OrderDetails           from '~/components/OrderDetails';
import LoadingError           from '~/components/LoadingError';
import CardForm               from '~/containers/payment/CardForm';
import * as actions           from '~/actions';

class Payment extends PureComponent {
  @autobind
  handleSubmitPayment() {
    const { returnUrl, payment, actions, orderId } = this.props;

    return Promise.resolve()
      .then(() => actions.validatePayment(payment))
      .then(() => actions.savePayment(payment))
      .then(() => returnUrl ? route(returnUrl) : actions.getOrder(orderId))
      .catch(console.error);
  }

  componentWillMount() {
    const { orderId, actions } = this.props;

    actions.updatePayment({ orderId });
  }

  componentDidMount() {
    const { orderId, orderLabel, actions } = this.props;

    if ( orderLabel === undefined ) {
      actions.getOrder( orderId );
    }
  }

  renderTitle(lang, label) {
    return (
      <IntlProvider definition={definition[lang]}>
        <div class="content">
          <h1>
            <Text id="title">Secure payment for order</Text><br />
            <em>{label}</em>
          </h1>
        </div>
      </IntlProvider>
    );
  }

  render() {
    const {
      lang,
      orderId,
      order,
      payment,
      isLoading,
    } = this.props;

    if ( isLoading ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    if ( order.error ) {
      return (
        <LoadingError
          lang={lang}
          label={orderId}
          error={order.error}
        />
      );
    }

    const { isValidated, errors } = payment;

    return (
      <IntlProvider definition={definition[lang]}>
        <div class="content">
          {this.renderTitle(lang, order.label)}

          <section>
            <OrderDetails order={order} lang={lang} />
          </section>
          <section>
            { !isValidated && !errors.payment && order.balance !== 0 ?
              <h3>
                <Text id="payment.title">Payment can be made by Mastercard or Visa.</Text>
              </h3>
              : ''
            }
            <CardForm />
          </section>

          { !isValidated && !errors.payment && order.balance !== 0 ?
            <nav class="text-center">
              { payment.isValidating || payment.isSaving ?
                <ProgressBar type="circular" mode="indeterminate" /> :
                <section style="margin-top: 2rem;">
                  <Button raised primary
                    disabled={!payment.cardNumber || !payment.cvv || !payment.expiryMonth
                    || !payment.expiryYear || !payment.holderName}
                    label={(
                      <Text id="payment.button" fields={{ amount: order.balance / -100 }}>
                        Pay AMOUNT€ Now
                      </Text>
                    )}
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

const definition = {
  'fr-FR': {
    title: 'Paiement sécurisé pour la facture de',
    payment: {
      title: 'Le Paiement peut s\'effectuer avec une carte Mastercard ou Visa.',
      button: 'Payer {{amount}}€',
    },
  },
  'en-US': {
    payment: { button: 'Pay {{amount}}€' },
  },
};

function mapStateToProps({ route: { lang, returnUrl }, orders, payment }, { orderId }) {
  const order = orders[orderId];

  if ( !order || order.isLoading ) {
    return { isLoading: true };
  }

  return {
    lang,
    returnUrl,
    orderId,
    order,
    payment,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
