import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import OrderDetails           from '~/containers/payment/OrderDetails';
import CardForm               from '~/containers/payment/CardForm';
import * as actions           from '~/actions';
import Utils                  from '~/utils';

class Payment extends PureComponent {
  componentWillMount() {
    const { orderId } = this.props;
    const { fetchOrder, receiveOrder } = this.props.actions;

    fetchOrder({ id: orderId });
    Utils.fetchOrder(orderId)
      .then((response) => receiveOrder(response.data))
      .catch(console.error);
  }

  render({ lang }) {
    const { order } = this.props;

    if ( order.isLoading ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div class="content text-center">
          <h1>
            <Text id="title">Pay order</Text><br />
            <em>{order.label}</em>
          </h1>

          <section>
            <OrderDetails orderId={order.id} />
          </section>

          <section>
            <CardForm />
          </section>

        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
} };

function mapStateToProps({ route, orders, payment }) {
  return {
    ...route,
    order: orders[route.orderId],
    payment,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
