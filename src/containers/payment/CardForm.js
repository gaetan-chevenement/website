import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import { IntlProvider, Text }       from 'preact-i18n';
import autobind               from 'autobind-decorator';
import { Input }              from 'react-toolbox/lib/input';
import * as actions           from '~/actions';
import Utils                  from '~/utils';

class CardForm extends PureComponent {
  @autobind
  handleChange(value, event) {
    const { actions } = this.props;
    batch(
      actions.updatePayment({ [event.target.name]: value }),
      actions.deletePaymentError(event.target.name)
    );
  }

  render() {
    const {
      lang,
      payment: { errors },
      orderBalance,
      payment,
      currYear,
      hasErrors,
    } = this.props;

    if (orderBalance === 0) {
      return (
        <section>
          <div class="handleError">
              <h4>
              This order has already been paid.
              </h4>
          </div>
        </section>
      )
    }
    if ( payment.isValidated ) {
      return (
        <div class="text-center">
          <h3>
            Your payment has been approved.<br />
            The Chez Nestor Team would like to wish you a great day!
          </h3>
        </div>
      )
    }
    if ( errors.payment ) {
      return (
        <section>
          <div class="handleError">
            { errors.payment.hasWrongBalance ? (
              <h4>
              This order has already been paid.
              </h4>
            ) : '' }

            { errors.payment.hasNoOrder ? (
              <h4>
              We cannot retrieve this order<br />
              Please contact the Chez Nestor Support Team.
              </h4>
            ) : '' }

            { errors.payment.unexpected ? (
              <h4>
              An unexpected error has occured.<br />
              { errors.payment.unexpected }
              </h4>
            ) : '' }
          </div>
        </section>
      )
    }
    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <section>
            <Input type="number"
              label="Card Number"
              name="cardNumber"
              value={payment.cardNumber}
              onChange={this.handleChange}
              error={errors.cardNumber}
            />
            <Input type="text"
              label="Holder Name"
              name="holderName"
              value={payment.holderName}
              onChange={this.handleChange}
              error={errors.holderName}
            />
            <p class="grid-3-large-1 has-gutter">
              <Input type="number" min="1" max="12" step="1"
                label="Expiry Month"
                name="expiryMonth"
                value={payment.expiryMonth}
                onChange={this.handleChange}
                error={errors.expiryMonth}
              />
              <Input type="number" min={currYear} max={currYear + 10} step="1"
                label="Expiry Year"
                name="expiryYear"
                value={payment.expiryYear}
                onChange={this.handleChange}
                error={errors.expiryYear}
              />
              <Input type="number" min="0" max="999" step="1"
                label="CVV"
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

const definition = { 'fr-FR': {

} };

function mapStateToProps({ route: { lang }, orders, payment }) {
  const { orderId } = payment;
  const order = orders[orderId];

  return {
    lang,
    payment,
    orderBalance: order && order.balance,
    hasErrors: Utils.hasErrors(payment),
    currYear: Utils.getCurrYear(),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CardForm);
