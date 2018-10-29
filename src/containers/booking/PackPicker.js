import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import PackList               from '~/components/PackList';
import Utils                  from '~/utils';
import * as actions           from '~/actions';

class PackPicker extends PureComponent {
  @autobind
  handlePackChange({ target: { name, value } }) {
    this.props.actions.updateBooking({ [name]: value });
  }

  render({ lang, packPrices, pack, minPack }) {
    return (
      <PackList
        {...{
          handlePackChange: this.handlePackChange,
          lang,
          packPrices,
          pack,
          minPack,
        }}
      />
    );
  }
}

function mapStateToProps({ route, booking, rooms, apartments, products }) {
  const { lang, minPack } = route;
  const { roomId, pack } = booking;
  const room = rooms[roomId];
  const city = apartments[room.ApartmentId].addressCity;
  const packPrices = Utils.getPackPrices({ products, city });

  return {
    lang,
    pack,
    packPrices,
    minPack,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PackPicker);
