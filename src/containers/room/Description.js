import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import * as actions           from '~/actions';

const _ = { capitalize };

class Pictures extends PureComponent {

  renderPicture({ url, alt, order }) {

  }
  render() {
    const {
      lang,
      room,
      room: { Features },
      apartment,
    } = this.props;

    if ( !room || !apartment || !Features ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }

    return (
      <IntlProvider definition={definition[lang]}>
        <section>
          <h3><Text id="title">Description</Text></h3>
          <ul class="grid-4 has-gutter">
            <li>{apartment.floorArea}m² (apartment)</li>
            <li>{apartment.floor} floor {Features.some((feature) => feature.name === 'noElevator' && feature.taxonomy === 'room-features-negative') ? ' whitout' : ' with'} elevator </li>
            <li>1 {/(^double$)|(^simple$)|(^sofa$)/.test(room.beds) ? `${room.beds} bed` : `${room.beds.split('+')[0]} bed and a ${room.beds.split('+')[1]}`}</li>
            <li>{room.floorArea}m² (room)</li>
            <li class="two-thirds">{apartment.addressStreet} {apartment.addressZip} {_.capitalize(apartment.addressCity)}, {_.capitalize(apartment.addressCountry)}</li>
          </ul>
          <div>{room[`description${_.capitalize(lang.split('-')[0])}`]}{apartment[`description${_.capitalize(lang.split('-')[0])}`]}</div>
        </section>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
} };

function mapStateToProps({ route: { lang }, rooms, apartments }, { roomId, apartmentId }) {
  const room = rooms[roomId];
  const apartment = apartments[apartmentId];

  return {
    lang,
    room,
    RoomFeatures: room && room.Features,
    apartment,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pictures);
