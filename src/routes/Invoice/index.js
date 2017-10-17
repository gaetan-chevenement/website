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
              <img src="/assets/icons/favicon-128.png" />
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
