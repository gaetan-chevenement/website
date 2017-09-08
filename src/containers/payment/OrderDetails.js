import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider }       from 'preact-i18n';
import autobind               from 'autobind-decorator';
import * as actions           from '~/actions';
import Utils                  from '~/utils';

class OrderDetails extends PureComponent {
  @autobind
  renderOrderItem({ label, unitPrice, quantity }) {
    return (
      <tr>
        <td>{label}</td>
        <td>{Utils.roundBy100(unitPrice)}</td>
        <td>{quantity}</td>
        <td>{Utils.roundBy100(unitPrice * quantity)}€</td>
      </tr>
    );
  }

  render() {
    const { order, lang } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <table>
          <thead>
            <tr>
              <td>Item</td>
              <td>Unit Price</td>
              <td>Quantity</td>
              <td>Total</td>
            </tr>
          </thead>
          <tbody>
            { order.orderItems.map(this.renderOrderItem) }
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">
                {order.conditions}
              </td>
              <td>
                <p>Total</p>
                <p>Paid</p>
                <p>Balance</p>
              </td>
              <td>
                <p>{Utils.roundBy100(order.amount)}</p>
                <p>{Utils.roundBy100(order.totalPaid)}</p>
                <p>{Utils.roundBy100(order.balance)}</p>
              </td>
            </tr>
          </tfoot>
        </table>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {

} };

function mapStateToProps({ route, orders }, { orderId }) {
  return {
    ...route,
    order: orders[orderId],
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);
