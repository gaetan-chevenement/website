import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import * as actions           from '~/actions';
import Utils                  from '~/utils';
import {
  IDENTITY_FORM_URL,
}                             from '~/const';

class Renting extends PureComponent {
  componentWillMount() {
    const { rentingId } = this.props;
    const {
      fetchRenting,
      receiveRenting,
      receiveOrders,
    } = this.props.actions;

    fetchRenting({ id: rentingId });
    Promise.all([
      Utils.fetchRenting(rentingId)
        .tap(console.log),
      Utils.fetchOrdersByRenting(rentingId)
        .tap(console.log),
    ])
      .then(([renting, orders]) => batch(
        receiveRenting(renting),
        receiveOrders(orders)
      ))
      .catch(console.error);

  }

  render({ lang }) {
    const { renting, room, packOrder } = this.props;

    if ( renting.isLoading ) {
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
            <Text id="title">Complete your booking for room</Text><br />
            <em>{room.name}</em>
          </h1>

          <section>
            <p>
              To complete your booking, please pay your Housing Pack invoice
              on our secure platform:<br />
              <a href={`/${lang}/payment/${packOrder.id}/3`}>
                Pay {packOrder.balance}€ now.
              </a>
            </p>
            <p>
              After that, please fill in this short identity form:<br />
              <a href={`${IDENTITY_FORM_URL}/${'a'}`}>
                {IDENTITY_FORM_URL}/{'a'}
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

function mapStateToProps({ route, rooms }) {
  return {
    ...route,
    room: rooms[route.roomId],
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Renting);
