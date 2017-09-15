import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import * as actions           from '~/actions';
import {
  IDENTITY_FORM_URL,
}                             from '~/const';
import Utils                  from '~/utils';

class Renting extends PureComponent {
  componentWillMount() {
    const { rentingId, actions } = this.props;

    batch(
      actions.getRenting( rentingId ),
      actions.listOrders({ rentingId })
    );
  }

  render() {
    const {
      lang,
      isRentingLoading,
      roomName,
      rentingId,
      clientId,
      packOrder = {},
    } = this.props;
    const paymentUrl =
      `/${lang}/payment/${packOrder.id}?returnUrl=/${lang}/renting/${rentingId}`;

    if ( isRentingLoading ) {
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

          <section>
            <p>
              To complete your booking, please pay your Housing Pack invoice
              on our secure platform:<br />
              <a href={paymentUrl}>
                Pay {-packOrder.balance / 100}€ now.
              </a>
            </p>
            <p>
              After that, please fill in this short identity form:<br />
              <a href={`${IDENTITY_FORM_URL}?clientId=${clientId}`}>
                {IDENTITY_FORM_URL}?clientId={clientId}
              </a>
            </p>

            <p>
              Once that is done, you'll receive your lease, to be signed online
              (<a href="https://drive.google.com/file/d/0B6uBt4Bf8BxuSnRod3d1TGp3bFU/view">
                specimen here
              </a>).
            </p>
            <p>
              And your room will be waiting for you!
            </p>
          </section>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
} };

function mapStateToProps({ route: { lang, rentingId }, rentings, orders, rooms }) {
  const renting = rentings[rentingId];
  const room = renting && rooms[renting.roomId];
  const { pack: packOrder } =
    Utils.classifyRentingOrders({ rentingId, orders });

  return {
    lang,
    rentingId,
    clientId: renting && renting.clientId,
    isRentingLoading: renting && renting.isLoading,
    roomName: room && room.name,
    packOrder,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Renting);
