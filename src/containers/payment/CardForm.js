import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import { IntlProvider }       from 'preact-i18n';
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
      payment,
      currYear,
    } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <section>
            <Input type="text"
              label="Card Number"
              name="cradNumber"
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

function mapStateToProps({ route: { lang }, payment }) {
  return {
    lang,
    payment,
    currYear: Utils.getCurrYear(),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CardForm);
