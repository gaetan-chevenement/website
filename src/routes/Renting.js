// THIS FILE IS DEPRECTAED

import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { Button }             from 'react-toolbox/lib/button';
import * as actions           from '~/actions';
import _const                 from '~/const';
import Utils                  from '~/utils';

const { IDENTITY_FORM_URLS } = _const;

class Renting extends PureComponent {
  componentDidMount() {
    const { rentingId, actions } = this.props;

    batch(
      actions.getRenting( rentingId ),
      actions.listOrders({ rentingId })
    );
  }

  render() {
    const {
      lang,
      isLoading,
      roomName,
      rentingId,
      packOrder = {},
      identityFormUrl,
    } = this.props;
    const paymentUrl =
      `/${lang}/payment/${packOrder.id}?returnUrl=/${lang}/renting/${rentingId}`;

    if ( isLoading ) {
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
            <Text id="title">Complete your booking for room</Text><br />
            <em>{roomName}</em>
          </h1>

          <div class="grid-3-large-1 has-gutter-xl">
            <div>
              <h3 class="text-center">1</h3>
              <p>
                To complete your booking, please pay your Housing Pack invoice
                on our secure platform:
              </p>
              <p class="text-center">
                <Button primary raised href={paymentUrl}>
                  Pay {-packOrder.balance / 100}€ now
                </Button>
              </p>
            </div>
            <div>
              <h3 class="text-center">2</h3>
              <p>
                We also need your personal details so that we can edit the lease agreement
                (<a href="https://drive.google.com/file/d/0B6uBt4Bf8BxuSnRod3d1TGp3bFU/view">
                  specimen here
                </a>):
              </p>
              <p class="text-center">
                <Button primary raised href={identityFormUrl}>
                  Fill in the form
                </Button>
              </p>
            </div>
            <div>
              <h3 class="text-center">3</h3>
              <p>
                Once that is done, you'll receive your lease, to be signed online.
                And your room will be waiting for you!
              </p>
              <h3 class="text-center">☺</h3>
            </div>
          </div>
        </div>
      </IntlProvider>
    );
  }
}

const definition = {
  'fr-FR': {
    title: 'Complétez votre réservation de la chambre',
  },
  'es-ES': {
    title: 'Complete su reserva de habitación',
  },
};

function mapStateToProps({ route: { lang }, rentings, orders, rooms }, { rentingId }) {
  const renting = rentings[rentingId];

  if ( !renting || renting.isLoading || !orders || orders.isLoading ) {
    return { isLoading: true };
  }

  const room = rooms[renting.RoomId];
  const { pack: packOrder } = Utils.classifyRentingOrders({ rentingId, orders });
  const packLevel =
    packOrder.OrderItems
      .find(({ ProductId }) => /-pack$/.test(ProductId))
      .ProductId.replace(/-pack$/, '');

  return {
    isLoading: false,
    lang,
    rentingId,
    identityFormUrl:
      `https://${IDENTITY_FORM_URLS[packLevel]}?clientId=${renting.ClientId}`,
    roomName: room && room.name,
    packOrder,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Renting);
