import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider }       from 'preact-i18n';
import autobind               from 'autobind-decorator';
import * as actions           from '~/actions';

class OrderDetails extends PureComponent {
  @autobind
  renderOrderItem({ label, unitPrice, quantity }) {
    return (
      <tr>
        <td>{label}</td>
        <td class="text-right">{unitPrice / 100}€</td>
        <td>{quantity}</td>
        <td class="text-right">{unitPrice * quantity / 100}€</td>
      </tr>
    );
  }

  render() {
    const {
      lang,
      order,
    } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th class="text-right">Unit Price</th>
                <th>Quantity</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              { order.OrderItems.map(this.renderOrderItem) }
            </tbody>
            <tfoot>
              <tr>
                <th colspan="2" style="vertical-align: bottom; font-weight: normal;">
                  <p>
                    {order.conditions}
                  </p>
                  <p>
                    <em>Order ref. {order.id}</em>
                  </p>
                </th>
                <th>
                  <p>Total</p>
                  <p>Paid</p>
                  <p>Balance</p>
                </th>
                <th class="text-right">
                  <p>{order.amount / 100}€</p>
                  <p>{order.totalPaid / 100}€</p>
                  <p>{order.balance / 100}€</p>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {

} };

function mapStateToProps({ route: { lang }, orders, payment }) {
  return {
    lang,
    order: orders[payment.orderId],
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);
