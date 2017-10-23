import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { Input }              from 'react-toolbox/lib/input';
import { Dropdown }           from 'react-toolbox/lib/dropdown';
import { Checkbox }           from 'react-toolbox/lib/checkbox';
import { batch }              from 'redux-act';
import { IntlProvider, Text } from 'preact-i18n';
import capitalize             from 'lodash/capitalize';
import autobind               from 'autobind-decorator';
import * as actions           from '~/actions';
import  district              from './district';


const _ = { capitalize };

class ApartmentDetails extends PureComponent {
  @autobind
  handleChange(value, event) {
    const { actions, apartment , apartmentId: id, roomId } = this.props;
    const noElevatorFeature = {
      name: 'noElevator',
      taxonomy: 'room-features-negative',
      termable: 'Room',
      TermableId: roomId,
    };
    const groundFloorFeature = {
      name: 'groundFloor',
      taxonomy: 'room-features-negative',
      termable: 'Room',
      TermableId: roomId,
    };

    if ( event.target.name === 'floor' ) {
      parseInt(value, 10) === 0 ?
        actions.addRoomFeature(groundFloorFeature) : actions.deleteRoomFeature(groundFloorFeature);
      parseInt(value, 10) >= 3 && !apartment.elevator ?
        actions.addRoomFeature(noElevatorFeature) : actions.deleteRoomFeature(noElevatorFeature);
    }
    if ( event.target.name === 'elevator' ) {
      value === false && apartment.floor >= 3 ?
        actions.addRoomFeature(noElevatorFeature) : actions.deleteRoomFeature(noElevatorFeature);
    }
    batch(
      actions.updateApartment({ [event.target.name]: value, id }),
      actions.deleteApartmentError(event.target.name),
    );
  }

  @autobind
  handleFeatureChange(value, event) {
    const { actions, apartmentId: id } = this.props;
    const feature = {};

    ['name', 'taxonomy', 'termable']
      .forEach((attribute) =>
        feature[attribute] = event.target.getAttribute(attribute)
      );

    feature.TermableId = id;
    event.target.checked ?
      actions.addApartmentFeature(feature) : actions.deleteApartmentFeature(feature);
  }

  @autobind
  handleBusChange(event) {
    const { actions, apartment, apartmentId: id } = this.props;
    let buses = event.target.value.split('\n');

    apartment.Features
      .filter((feat) => feat.taxonomy === 'apartment-features-transport-bus')
      .map((feature) => actions.deleteApartmentFeature(feature));
    buses = buses.filter((bus, index, buses) => buses.indexOf(bus) === index);
    buses.forEach((bus) => {
      let feature = {
        name: bus,
        taxonomy: 'apartment-features-transport-bus',
        termable: 'Apartment',
        TermableId: id,
      };
      bus.length > 0 ? actions.addApartmentFeature(feature): null;
    });
  }

  render() {
    const {
      lang,
      apartment,
      getFeatures,
      apartments: { errors },
    } = this.props;

    if ( !apartment || getFeatures === undefined ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }
    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <Input type="text"
            label={<Text id="address">Address</Text>}
            name="addressStreet"
            required
            value={apartment.addressStreet}
            onChange={this.handleChange}
            error={errors && errors.addressStreet}
          />
          <Input type="number"
            label={<Text id="zipCode">ZIP code</Text>}
            name="addressZip"
            required
            value={apartment.addressZip}
            onChange={this.handleChange}
            error={errors && errors.addressZip}
          />
          <Dropdown
            onChange={this.handleChange}
            label={<Text id="city">City</Text>}
            required
            name="addressCity"
            value={apartment.addressCity}
            source={cities}
            error={errors && errors.addressCity}
          />
          <Dropdown
            onChange={this.handleChange}
            label={<Text id="country">Country</Text>}
            name="addressCountry"
            required
            auto
            value={apartment.addressCountry}
            source={countries}
            error={errors && errors.addressCountry}
          />
          {apartment.addressCity ?
            <Dropdown
              onChange={this.handleChange}
              label={<Text id="district">Neighborhood</Text>}
              name="district"
              required
              auto
              value={apartment.district}
              source={Object.keys(district[apartment.addressCity])
                .map((district) => ({ value: district, label: _.capitalize(district) }) )}
              error={errors && errors.district}
            /> : ''
          }
          <Input type="number"
            label={<Text id="floor">Floor</Text>}
            name="floor"
            required
            value={apartment.floor}
            onChange={this.handleChange}
            error={errors && errors.floor}
          />
          <Dropdown
            onChange={this.handleChange}
            label={<Text id="elevator">Elevator</Text>}
            name="elevator"
            required
            auto
            value={!!apartment.elevator}
            source={[{ value: true, label: 'yes' } , { value: false, label: 'no' }]}
          />
          <Input type="number"
            label={<Text id="floorArea">Surface</Text>}
            name="floorArea"
            required
            value={apartment.floorArea}
            onChange={this.handleChange}
            error={errors && errors.floorArea}
          />
          <Input type="text"
            label={<Text id="digicode">Digicode</Text>}
            name="code"
            value={apartment.code}
            onChange={this.handleChange}
          />
          <h3 style="text-align:center;">Transport</h3>
          <dl class="grid-4 has-gutter-xl">
            <div>
              <h5>Nearby Bike Station</h5>
              <ul style="height: 150px;overflow: scroll;">
                {nearbyBike.map((dist) => (
                  <Checkbox
                    checked={apartment.Features.some((feat) => feat.name === dist.value && feat.taxonomy === 'apartment-features-nearbyBike')}
                    label={dist.label}
                    taxonomy="apartment-features-nearbyBike"
                    termable="Apartment"
                    onChange={this.handleFeatureChange}
                    name={dist.value}
                  />
                ))}
              </ul>
            </div>
            <div>
              <h5>Subway</h5>
              {apartment.addressCity ?
                <div>
                  <ul style="height: 150px;overflow: scroll;">
                    {transport[apartment.addressCity].subway.map((sub) => (
                      <Checkbox
                        checked={apartment.Features.some((feat) => feat.name === sub.value && feat.taxonomy === 'apartment-features-transport-subway')}
                        label={sub.label}
                        taxonomy="apartment-features-transport-subway"
                        termable="Apartment"
                        onChange={this.handleFeatureChange}
                        name={sub.value}
                      />
                    ))}
                  </ul> </div>: ''
              }
            </div>
            <div>
              <h5>Tramway</h5>
              {apartment.addressCity ?
                <div>
                  <ul style="height: 150px;overflow: scroll;">
                    {transport[apartment.addressCity].tramway.map((sub) => (
                      <Checkbox
                        checked={apartment.Features.some((feat) => feat.name === sub.value && feat.taxonomy === 'apartment-features-transport-tramway')}
                        label={sub.label}
                        taxonomy="apartment-features-transport-tramway"
                        termable="Apartment"
                        onChange={this.handleFeatureChange}
                        name={sub.value}
                      />
                    ))}
                  </ul>
                </div> : ''
              }</div>
            <div>
              <h5>Bus</h5>
              <Input type="text"
                multiline
                label={<Text id="busHint">One bus per line</Text>}
                value={apartment.Features
                  .filter((feat) => feat.taxonomy === 'apartment-features-transport-bus')
                  .map((feature) => feature.name).join('\n')}
                onBlur={this.handleBusChange}
              />
            </div>
          </dl>
          <h3 style="text-align:center;"><Text id="description.title">Description</Text></h3>
          <dl class="grid-3 has-gutter-l">
            <div>
              <Input type="text"
                multiline
                name="descriptionFr"
                label={<Text id="description.fr">French Description</Text>}
                value={apartment.descriptionFr}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <Input type="text"
                multiline
                name="descriptionEn"
                label={<Text id="description.en">English Description</Text>}
                value={apartment.descriptionEn}
                onChange={this.handleChange}
              />
            </div>
            <div>
              <Input type="text"
                multiline
                name="descriptionEs"
                label={<Text id="description.es">Spanish Description</Text>}
                value={apartment.descriptionEs}
                onChange={this.handleChange}
              />
            </div>
          </dl>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {

} };
function mapStateToProps({ route: { lang, admin }, rooms, apartments }, { apartmentId, roomId }) {
  const apartment = apartments[apartmentId];

  return {
    lang,
    admin,
    roomId,
    apartments,
    apartment,
    apartmentId,
    getFeatures: apartment && apartment.Features && apartment.Features.length > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

const cities = [
  {
    value: 'lyon', label: 'Lyon',
  }, {
    value: 'paris', label: 'Paris',
  }, {
    value: 'montpellier', label: 'Montpellier',
  },
];

const transport = {
  lyon: {
    subway: [{
      value: 'A',
      label: 'A',
    }, {
      value: 'B',
      label: 'B',
    }, {
      value: 'C',
      label: 'C',
    }, {
      value: 'D',
      label: 'D',
    }, {
      value: 'F1',
      label: 'F1',
    }, {
      value: 'F2',
      label: 'F2',
    }],
    tramway: [{
      value: 'T1',
      label: 'T1',
    }, {
      value: 'T2',
      label: 'T2',
    }, {
      value: 'T3',
      label: 'T3',
    }, {
      value: 'T4',
      label: 'T4',
    }, {
      value: 'T5',
      label: 'T5',
    }],
  },
  paris: {
    subway: [{
      value: '1',
      label: '1',
    }, {
      value: '2',
      label: '2',
    }, {
      value: '3',
      label: '3',
    }, {
      value: '3b',
      label: '3b',
    }, {
      value: '4',
      label: '4',
    }, {
      value: '5',
      label: '5',
    }, {
      value: '6',
      label: '6',
    }, {
      value: '7',
      label: '7',
    }, {
      value: '7b',
      label: '7b',
    }, {
      value: '8',
      label: '8',
    }, {
      value: '9',
      label: '9',
    }, {
      value: '10',
      label: '10',
    }, {
      value: '11',
      label: '11',
    }, {
      value: '12',
      label: '12',
    }, {
      value: '13',
      label: '13',
    }, {
      value: '14',
      label: '14',
    }],
    tramway: [{
      value: '1',
      label: '1',
    }, {
      value: '2',
      label: '2',
    }, {
      value: '3a',
      label: '3a',
    }, {
      value: '3b',
      label: '3b',
    }, {
      value: '5',
      label: '5',
    }, {
      value: '6',
      label: '6',
    }, {
      value: '7',
      label: '7',
    }, {
      value: '8',
      label: '8',
    }],
  },
  montpellier: {
    subway: [],
    tramway: [{
      value: '1',
      label: '1',
    }, {
      value: '2',
      label: '2',
    }, {
      value: '3',
      label: '3',
    }, {
      value: '4',
      label: '4',
    }],
  },
};

const nearbyBike = [
  {
    value: '25', label: '25m',
  }, {
    value: '50', label: '50m',
  }, {
    value: '75', label: '75m',
  }, {
    value: '100', label: '100m',
  }, {
    value: '125', label: '125m',
  }, {
    value: '150', label: '150m',
  }, {
    value: '175', label: '175m',
  }, {
    value: '200', label: '200m',
  }, {
    value: '250', label: '250m',
  }, {
    value: '300', label: '300m',
  }, {
    value: '350', label: '350m',
  }, {
    value: '400', label: '400m',
  }, {
    value: '450', label: '450m',
  }, {
    value: '500', label: '500m',
  },
];

const countries = [
  {
    value: 'france', label: 'France',
  },
];


export default connect(mapStateToProps, mapDispatchToProps)(ApartmentDetails);
