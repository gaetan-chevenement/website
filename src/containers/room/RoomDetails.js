import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { Input }              from 'react-toolbox/lib/input';
import { Checkbox }           from 'react-toolbox/lib/checkbox';
import { Dropdown }           from 'react-toolbox/lib/dropdown';
import { IntlProvider, Text } from 'preact-i18n';
import autobind               from 'autobind-decorator';
import * as actions           from '~/actions';

const negativeFeatures = [
  {
    value: 'overlooked', label: 'Vis à vis',
  }, {
    value: 'dark', label: 'Sombre',
  }, {
    value: 'noisy', label: 'Bruyant',
  }, {
    value: 'small', label: 'Surface < 10m2',
  }, {
    value: 'lowIncome', label: 'Quartier peu vivant',
  }, {
    value: 'unsafe', label: 'Peu sécurisé',
  }, {
    value: 'fewStorage', label: 'Peu de rangement',
  }, {
    value: 'offCentre', label: 'Excentré',
  }, {
    value: 'wet', label: 'Humide',
  }, {
    value: 'noElevator', label: 'Etage 3 ou + sans ascenseur',
  }, {
    value: 'groundFloor', label: 'Rez-de-chaussée',
  }, {
    value: 'awayTransport', label: 'Loin des transports',
  }, {
    value: 'strictNeighbor', label: 'Voisinage strict',
  },
];

const bedDetails = [
  {
    value: 'double', label: 'Double',
  }, {
    value: 'simple', label: 'Simple',
  }, {
    value: 'sofa', label: 'Sofa',
  }, {
    value: 'double+sofa', label: 'Double And Sofa',
  }, {
    value: 'simple+sofa', label: 'Simple And Sofa',
  }, {
    value: 'simple+simple', label: 'Simple And Simple',
  },
];

class RoomDetails extends PureComponent {
  @autobind
  handleChange(value, event) {
    const { actions, roomId: id } = this.props;
    value = event.target.name === 'basePrice' ? value * 100 : value ;
    event.target.name === 'floorArea' && value < 10 ?
      actions.addRoomFeature({ name: 'small', taxonomy: 'room-features-negative', termable: 'Room', TermableId: id }) :
      actions.deleteRoomFeature({ name: 'small', taxonomy: 'room-features-negative', termable: 'Room', TermableId: id });

    actions.updateRoom({ [event.target.name]: value, id });
  }

  @autobind
  handleFeatureChange(value, event) {
    const { actions, roomId: id } = this.props;
    const feature = {};

    ['name', 'taxonomy', 'termable']
      .forEach((attribute) =>
        feature[attribute] = event.target.getAttribute(attribute)
      );

    feature.TermableId = id;
    event.target.checked ?
      actions.addRoomFeature(feature) : actions.deleteRoomFeature(feature);
  }

  render() {
    const {
      lang,
      room,
      getFeatures,
      //      room: { errors },
      roomId,
    } = this.props;

    if ( !room || getFeatures === undefined ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }
    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <h2 style="text-align:center;">Details for room - {roomId}</h2>
          <Input type="number"
            label={<Text id="basePrice">Base Price</Text>}
            name="basePrice"
            required
            value={room.basePrice /100}
            onChange={this.handleChange}
          />
          <Input type="number"
            label={<Text id="floorArea">Surface</Text>}
            name="floorArea"
            required
            value={room.floorArea}
            onChange={this.handleChange}
          />
          <Dropdown
            label={<Text id="beds">Beds type</Text>}
            name="beds"
            required
            value={room.beds}
            source={bedDetails}
            onChange={this.handleChange}
          />
          <h3 style="text-align:center;"><Text id="description.title">Description</Text></h3>
          <dl class="grid-3 has-gutter-l">
            <div>
              <Input type="text"
                multiline
                name="descriptionFr"
                label={<Text id="description.fr">French Description</Text>}
                value={room.descriptionFr}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <Input type="text"
                multiline
                name="descriptionEn"
                label={<Text id="description.en">English Description</Text>}
                value={room.descriptionEn}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <Input type="text"
                multiline
                name="descriptionEs"
                label={<Text id="description.es">Spanish Description</Text>}
                value={room.descriptionEs}
                onChange={this.handleChange}
              />
            </div>
          </dl>
          <h3 style="text-align:center;"><Text id="negative.title">Negative Features</Text></h3>
          <dl class="grid-4 has-gutter-l">
            {negativeFeatures.map((feature) => (
              <Checkbox
                checked={room.Features.some((feat) => feat.name === feature.value && feat.taxonomy === 'room-features-negative')}
                label={feature.label}
                taxonomy="room-features-negative"
                termable="Room"
                onChange={this.handleFeatureChange}
                name={feature.value}
              />
            ))}
          </dl>

        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {

} };

function mapStateToProps({ route: { lang, admin }, rooms, apartments }, { roomId }) {
  const room = rooms[roomId];

  return {
    lang,
    admin,
    room,
    roomId,
    getFeatures: room && room.Features && room.Features.length > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomDetails);
