import { PureComponent }      from 'react';
import { IntlProvider, Text } from 'preact-i18n';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import D                      from 'date-fns';
import capitalize             from 'lodash/capitalize';
import * as actions           from '~/actions';
import Utils                  from '~/utils';
import style                  from './style';

const _ = { capitalize };

class Invoice extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      client: false,
      metadata: false,
      apartment: false,
      error: false,
    };
  }

  componentDidMount() {
    const { orderId, actions, order } = this.props;

    if ( !order ) {
      return Promise.resolve()
        .then(() => actions.getOrder( orderId ))
        .then(({ request, response }) => Promise.all([
          response.included.find((inc) => inc.type === 'order').attributes.id,
          response.included.find((inc) => inc.type === 'renting').attributes.id,
        ]))
        .then(([orderId , rentingId]) => Promise.all([
          Utils.fetchJson(`/Order/${orderId}`),
          Utils.fetchJson(`/Renting/${rentingId}`)]))
        .then(([{ included: orderIncluded },  { included: rentingIncluded } ]) => {
          this.setState({ client: orderIncluded.find((inc) => inc.type === 'client').attributes });
          return Promise.all([
            orderIncluded.find((inc) => inc.type === 'client').attributes.id,
            rentingIncluded.find((inc) => inc.type === 'room').attributes.id,
          ]);
        })
        .then(([clientId, roomId]) => Promise.all([
          Utils.fetchJson(`/Metadata?filterType=and&filter[MetadatableId]=${clientId}&filter[name]=clientIdentity&filter[metadatable]=Client`),
          Utils.fetchJson(`/Room/${roomId}`),
        ]))
        .then(([{ data: clientMetadata }, { included: roomIncluded } ]) => this.setState({
          metadata: clientMetadata.length > 0 ?
            JSON.parse(clientMetadata.find((_data) => _data.type === 'metadata').attributes.value) :
            {} ,
          apartment: roomIncluded.find((inc) => inc.type === 'apartment').attributes }));
    }
  }

  renderOrderItem({ label, unitPrice, vatRate, quantity }) {
    return (
      <tr>
        <td class={`${style.title} text-left`}>{label}</td>
        <td class="text-right">{unitPrice /100}€</td>
        <td class="text-right">{vatRate > 0 ? `${vatRate * 100}%` : ''}</td>
        <td class="text-right">{quantity}</td>
        <td class="text-right">{unitPrice * quantity / 100}€</td>
      </tr>
    );
  }

  renderInvoiceDetails() {
    const { order, lang } = this.props;
    return   (
      <table class={`${style['table-3']} ${style.noborder}`}>
        <th class="text-left">
          <p>Total</p>
          <p><Text id="paid">Paid</Text></p>
          <p><Text id="balance">Balance</Text></p>
          <p><Text id="state">State</Text></p>
        </th>
        <th class="text-right">
          <p>{order.amount / 100}€</p>
          <p>{order.totalPaid / 100}€</p>
          <p>{order.balance / 100}€</p>
          <p>{order.balance < 0 ? lang ==='fr-FR' ? 'Impayée' : 'Unpaid': lang ==='fr-FR' ? 'Payée' : 'Paid'}</p>
        </th>
      </table>
    );
  }

  render() {
    const {
      lang,
      order,
      isOrderLoading,
    } = this.props;
    const {
      client,
      metadata,
      apartment,
      metadata: { address },
      apartment: { addressCity, addressCountry, addressStreet, addressZip },
    } = this.state;

    if ( isOrderLoading || !order || !client || !metadata || !apartment ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <div class={style['invoice-content']}>
          <div class={style.logo}>
            <span>
              <img src="data:image/png;base64,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" />
            </span>
          </div>
          <table class={`${style['table-0']} ${style.noborder}`} cellspacing="0" cellpadding="0">
            <tr>
              <td class={style.title}>Chez Nestor</td>
              <td>Chez Nestor</td>
            </tr>
            <tr>
              <td><a href="www.chez-nestor.com">www.chez-nestor.com</a></td>
              <td>16, Rue de Condé</td>
            </tr>
            <tr>
              <td><a href="mailto:support@chez-nestor.com">support@chez-nestor.com</a>
              </td>
              <td>69002, Lyon</td>
            </tr>
            <tr>
              <td>+33 (0) 972 323 102</td>
              <td>France</td>
            </tr>
          </table>
          <div class={style['invoice-title']}>
            <p><Text id="title">Invoice</Text> #{order.receiptNumber}</p>
          </div>
          <table class={`${style['table-1']} ${style.noborder}`}>
            <tr>
              <td class={style.top}><b><Text id="due.date">Due Date</Text></b></td>
              <td class={style.top}><b><Text id="due.amount">Amount Due</Text></b></td>
              <td class={style.top}><b><Text id="address.billing">Billing Address</Text></b></td>
              <td class={style.top}><b><Text id="address.property">Property Address</Text></b></td>
            </tr>
            <tr>
              <td class="text-left">{D.format(order.dueDate, 'DD/MM/YYYY')}</td>
              <td class="text-left">{-order.balance / 100}€</td>
              <td>{client['Full Name']}</td>
              <td>{addressStreet ? addressStreet : ''}</td>
            </tr>
            <tr>
              <td />
              <td />
              <td >{address ? `${address.addr_line1} ${address.addr_line2}`: ''}</td>
              <td>{addressZip && addressCity ? `${addressZip}, ${_.capitalize(addressCity)}` : ''}</td>
            </tr>
            <tr>
              <td />
              <td />
              <td>{address ? `${address.postal}, ${address.city}, ${address.state}`: ''}</td>
              <td>{addressCountry ? `${_.capitalize(addressCountry)}` : ''}</td>
            </tr>
            <tr>
              <td />
              <td />
              <td>{address ? `${address.country}`: ''}</td>
              <td />
            </tr>
            <tr>
              <td class={style.bottom} />
              <td class={style.bottom} />
              <td class={style.bottom}>{client.email}</td>
              <td class={style.bottom} />
            </tr>
          </table>
          <table class={style['table-2']}>
            <tr>
              <td class="text-left"><strong><Text id="item">Item</Text></strong></td>
              <td class="text-right"><strong><Text id="unitPrice">Unit Price</Text></strong></td>
              <td class="text-right"><strong><Text id="vat">VAT Rate</Text></strong></td>
              <td class="text-right"><strong><Text id="quantity">Quantity</Text></strong></td>
              <td class="text-right"><strong>Total</strong></td>
            </tr>
            { ( order.OrderItems || [] ).map(this.renderOrderItem) }
          </table>
          <div class={style['invoice-part3']}>
            <div class={style.conditions}>
              <p>Conditions<br />La présente quittance ne libère l'occupant que pour la période indiquée et annule tout reçu à valoir. Elle n'est pas libératoire des loyers antérieurs impayés et est délivrée sous réserve de toutes instances judiciaires en cours.</p>
            </div>
            {this.renderInvoiceDetails()}
          </div>
          <footer class={style.footer}>
            <p>MY FRENCH LIFEGUARD | 16 rue de Condé 69002 Lyon | +33 (0)972323102 | lyon@myfrenchlifeguard.com</p>
            <p>www.myfrenchlifeguard.com | SARL au capital de 10.000€ immatriculée au RCS de Lyon</p>
            <p>SIRET n°751570003 00036 | N° de TVA intracommunautaire FR20 751 570 003</p>
          </footer>
        </div>

      </IntlProvider>

    );
  }
}

function mapStateToProps({ route: { lang, returnUrl }, orders }, { orderId }) {
  const order = orders[orderId];

  return {
    lang,
    orderId,
    order,
    isOrderLoading: order === undefined || order.isLoading,
  };
}

const definition = { 'fr-FR': {
  title: 'Facture',
  address: {
    billing: 'Addresse de facturation',
    property: 'Addresse du bien',
  },
  due: {
    date: 'Date d\'échéance',
    amount: 'Montant dû',
  },
  item: 'Produits',
  unitPrice: 'Prix Unitaire',
  vat: 'TVA',
  quantity: 'Quantité',
  paid: 'Payé à ce jour',
  balance: 'Montant dû',
  state: 'État',
} };

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Invoice);
