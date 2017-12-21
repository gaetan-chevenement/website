import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import * as actions           from '~/actions';

import style from './style.css';

class BookingInfo extends PureComponent {
  render() {
    const { lang } = this.props;
    return (
      <IntlProvider definition={definition[lang]}>
        <section className={style.bookingInfo}>
          <h3>Paiement mensuels</h3>
          <hr />
          <h3>Paiements fixes</h3>
          <hr />
          <h3>Inclus</h3>
        </section>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {} };

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];

  return {
    room,
    lang
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingInfo);
