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
    const { updateCard, deleteCardError } = this.props.actions;

    batch(
      updateCard({ [event.target.name]: value }),
      deleteCardError(event.target.name)
    );
  }

  render() {
    const { lang, card, currYear } = this.props;
    const { errors } = card;

    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <section>
            <Input type="text"
              label="Card Number"
              name="cradNumber"
              value={card.cardNumber}
              onChange={this.handleChange}
              error={errors.cardNumber}
            />
            <Input type="text"
              label="Holder Name"
              name="holderName"
              value={card.holderName}
              onChange={this.handleChange}
              error={errors.holderName}
            />
            <Input type="number" min="1" max="12" step="1"
              label="Expiry Month"
              name="expiryMonth"
              value={card.expiryMonth}
              onChange={this.handleChange}
              error={errors.expiryMonth}
            />
            <Input type="number" min={currYear} max={currYear + 10} step="1"
              label="Expiry Year"
              name="expiryYear"
              value={card.expiryYear}
              onChange={this.handleChange}
              error={errors.expiryYear}
            />
            <Input type="number" min="0" max="999" step="1"
              label="CVV"
              name="cvv"
              value={card.cvv}
              onChange={this.handleChange}
              error={errors.cvv}
            />
          </section>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {

} };

function mapStateToProps({ route, card }) {
  return {
    ...route,
    card,
    currYear: Utils.getCurrYear(),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CardForm);
