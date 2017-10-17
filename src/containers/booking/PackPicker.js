import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import PackList               from '~/components/PackList';
import * as actions           from '~/actions';
import { PACK_PRICES }        from '~/const';

class PackPicker extends PureComponent {
  @autobind
  handlePackChange(event) {
    this.props.actions.updateBooking({ [event.target.name]: event.target.value });
  }

  render() {
    const {
      lang,
      pack,
      minPack,
      packPrices,
    } = this.props;

    return (
      <PackList lang={lang} packPrices={packPrices} pack={pack} minPack={minPack} renderButton />
    );
  }
}

function mapStateToProps({ route, booking, rooms, apartments }) {
  const { lang, minPack } = route;
  const { roomId, pack } = booking;
  const room = rooms[roomId];

  return {
    lang,
    pack,
    minPack,
    packPrices: PACK_PRICES[room && apartments[room.ApartmentId].addressCity],
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PackPicker);
