import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { Input }              from 'react-toolbox/lib/input';
import { Dropdown }           from 'react-toolbox/lib/dropdown';
import { Checkbox }           from 'react-toolbox/lib/checkbox';
import { IconButton }         from 'react-toolbox/lib/button';
import Dropzone               from 'react-dropzone';
import capitalize             from 'lodash/capitalize';
import { batch }              from 'redux-act';
import uuid                   from 'uuid/v4';
import Promise                from 'bluebird';
import { IntlProvider, Text } from 'preact-i18n';
import autobind               from 'autobind-decorator';
import * as actions           from '~/actions';

const _= { capitalize };

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
  handlePictureChange(event) {
    const { actions, apartmentId: id } = this.props;
    const picture = {
      order: event.target.value,
      picturable: event.target.getAttribute('picturable'),
      id: event.target.getAttribute('pictureId'),
      PicturableId: id,
    };
    batch(
      actions.updateApartmentPicture({ picture, id }),
      actions.deleteApartmentError(event.target.name),
    );
  }

  @autobind
  handlePictureAltChange(pictureId) {
    return (value, event) => {
      const { actions, apartmentId: id } = this.props;
      const picture = {
        alt: value,
        picturable: 'Apartment',
        id: pictureId,
        PicturableId: id,
      };
      batch(
        actions.updateApartmentPicture({ picture, id }),
        actions.deleteApartmentError(event.target.name),
      );
    };
  }

  @autobind
  handlePictureDelete(event) {
    const { actions, apartmentId: id } = this.props;
    const picture = {
      PicturableId: id,
      id: event.target.getAttribute('pictureId'),
    };
    actions.deleteApartmentPicture(picture);
  }

  @autobind
  onDrop(acceptedFiles, rejectedFiles) {
    const { actions, apartmentId } = this.props;
    Promise.mapSeries(acceptedFiles, (file) => {
      const reader = new FileReader();
      reader.onload = () => {
        actions.addApartmentPicture({
          url: reader.result,
          picturable: 'Apartment',
          PicturableId: apartmentId,
          id: uuid() });
      };
      reader.readAsDataURL(file);
    });
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
      apartment: { Pictures },
      getFeatures,
      getPictures,
      apartments: { errors },
    } = this.props;

    if ( !apartment || getFeatures === undefined || getPictures === undefined  ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }
    return (
      <IntlProvider definition={definition[lang]}>
        <section>
          <h2 style="text-align:center;"><Text id="title">Details for apartment</Text> - {apartment.name}</h2>

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
            value={parseInt(apartment.addressZip, 10)}
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
              source={district[apartment.addressCity]}
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
          <br />
          <div style="text-align:center;">
            <h3><Text id="picture.title">Upload Pictures</Text></h3>
            <br />
            <Dropzone style={{ display: 'inline-block',
              width: '400px',
              height: '110px',
              'border-width': '2px',
              'border-color': 'rgb(29, 44, 73)',
              'border-style': 'dashed',
              'border-radius': '5px',
            }} onDrop={this.onDrop} accept="image/jpeg, image/jpg" multiple
            >
              <div style="position:relative;margin:16px auto;"><Text id="picture.hint.first">Drop some files here, or click to upload files.</Text><br /><Text id="picture.hint.second">Only *.jpeg and *.jpg pictures.</Text></div>
            </Dropzone>
            <br />
            <dl class="grid-3 has-gutter-l">
              {Pictures.map((picture) => (
                <div>
                  <div style="position:relative;">
                    <div style="position:absolute;top:4px;">
                      <IconButton
                        icon="delete"
                        raised
                        onClick={this.handlePictureDelete}
                        pictureId={picture.id}
                      />
                    </div>
                    <img src={picture.url} style="max-height: 300px; max-width: 300px;" />
                  </div>
                  <Input type="number"
                    label={<Text id="picture.order">Order</Text>}
                    name="order"
                    picturable="Apartment"
                    required
                    pictureId={picture.id}
                    value={picture.order}
                    onBlur={this.handlePictureChange}
                    error={errors && errors.order}
                  />
                  <Dropdown
                    onChange={this.handlePictureAltChange(picture.id)}
                    label={<Text id="picture.caption">Caption</Text>}
                    name="alt"
                    required
                    auto
                    value={picture.alt}
                    source={captions}
                    error={errors && errors.alt}
                  />
                </div>
              )
              )}</dl>
          </div>
          <h3 style="text-align:center;">Transport</h3>
          <br />
          <dl class="grid-4 has-gutter-xl">
            <div>
              <h5><Text id="bike">Nearby Bike Station</Text></h5>
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
            {apartment.addressCity ?
              Object.keys(transport[apartment.addressCity]).map((value, key) => (
                <div>
                  <h5><Text id="transport" fields={{ name: value === 'subway' ? 'Métro' : value === 'tramway' ? 'Tramway' : value === 'rer' ? 'Rer' : 'Transilien' }}>{_.capitalize(value)}</Text></h5>
                  <ul style="height: 150px;overflow: scroll;">
                    {transport[apartment.addressCity][value].map((data) => (
                      <Checkbox
                        checked={apartment.Features.some((feat) =>  feat.name === data.value && feat.taxonomy === `apartment-features-transport-${value}`)}
                        label={data.label}
                        taxonomy={`apartment-features-transport-${value}`}
                        termable="Apartment"
                        onChange={this.handleFeatureChange}
                        name={data.value}
                      />
                    ))}
                  </ul>
                </div>
              )) : ''
            }
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
          <br />
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
        </section>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  title: 'Détails de l\'appartement',
  address: 'Adresse',
  zipCode: 'Code Postal',
  city: 'Ville',
  country: 'Pays',
  district: 'Quartier',
  floor: 'Étage',
  elevator: 'Ascenseur',
  floorArea: 'Surface',
  digicode: 'Digicode',
  bike: 'Stations de vélo les plus proches',
  transport: '{{name}}',
  busHint: 'Une ligne de bus par ligne',
  description: {
    title: 'Descriptions',
    fr: 'description française',
    en: 'description anglaise',
    es: 'description espagnole',
  },
  picture: {
    title: 'Télécharger des photos',
    hint: {
      first: 'Déposez des fichiers, ou cliquez pour télécharger des fichiers.',
      second: 'Seulement des images *.jpeg ou *.jpg',
    },
    order: 'Ordre',
    caption: 'Description',
  },
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
    getPictures: apartment && apartment.Pictures && apartment.Pictures.length > 0,
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
    rer: [{
      value: 'A',
      label: 'A',
    }, {
      value: 'B',
      label: 'B',
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
      value: 'E',
      label: 'E',
    }],
    transilien: [{
      value: 'H',
      label: 'H',
    }, {
      value: 'J',
      label: 'J',
    }, {
      value: 'K',
      label: 'K',
    }, {
      value: 'L',
      label: 'L',
    }, {
      value: 'N',
      label: 'N',
    }, {
      value: 'P',
      label: 'P',
    }, {
      value: 'R',
      label: 'R',
    }, {
      value: 'U',
      label: 'U',
    }],
    tramway: [{
      value: 'T1',
      label: 'T1',
    }, {
      value: 'T2',
      label: 'T2',
    }, {
      value: 'T3a',
      label: 'T3a',
    }, {
      value: 'T3b',
      label: 'T3b',
    }, {
      value: 'T4',
      label: 'T4',
    }, {
      value: 'T5',
      label: 'T5',
    }, {
      value: 'T6',
      label: 'T6',
    }, {
      value: 'T7',
      label: 'T7',
    }, {
      value: 'T8',
      label: 'T8',
    }],
  },
  montpellier: {
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

const district = {
  lyon: [{
    value: 'ainay',
    label: 'Ainay - Presqu\'île',
  }, {
    value: 'confluence',
    label: 'Confluence - Presqu\'île',
  }, {
    value: 'bellecour',
    label: 'Bellecour - Presqu\'île',
  },{
    value: 'hotel-de-ville',
    label: 'Hôtel de Ville - Presqu\'île',
  },{
    value: 'croix-rousse',
    label: 'Croix-Rousse',
  },{
    value: 'tete-dor',
    label: 'Tête d\'Or',
  },{
    value: 'brotteaux',
    label: 'Brotteaux',
  },{
    value: 'foch',
    label: 'Foch',
  },{
    value: 'part-dieu',
    label: 'Part-Dieu',
  },{
    value: 'manufacture',
    label: 'Manufacture',
  },{
    value: 'prefecture',
    label: 'Préfecture',
  },{
    value: 'quais-de-rhone',
    label: 'Quais de Rhône',
  },{
    value: 'guillotiere',
    label: 'Guillotière',
  },{
    value: 'universites',
    label: 'Universités',
  },{
    value: 'jean-mace',
    label: 'Jean Macé',
  },{
    value: 'garibaldi',
    label: 'Garibaldi',
  },{
    value: 'jet-deau',
    label: 'Jet d\'Eau',
  },{
    value: 'debourg-gerland',
    label: 'Debourg - Gerland',
  },{
    value: 'vieux-lyon',
    label: 'Vieux Lyon',
  },{
    value: 'vaise',
    label: 'Vaise',
  },{
    value: '1er-arrondissement',
    label: '1er Arrondissement',
  }],
  paris: [{
    value: 'opera-grands-boulevards',
    label: 'Opéra - Grands Boulevards',
  }, {
    value: 'marais',
    label: 'Marais',
  }, {
    value: '4e-arrondissement',
    label: '4e Arrondissement',
  }, {
    value: '5e-arrondissement',
    label: '5e Arrondissement',
  }, {
    value: '6e-arrondissement',
    label: '6e Arrondissement',
  }, {
    value: 'champs-de-mars',
    label: 'Champs de Mars',
  }, {
    value: 'orsay-invalides',
    label: 'Orsay - Invalides',
  }, {
    value: 'etoile-champs-elysees',
    label: 'Etoile - Champs Elysées',
  }, {
    value: 'saint-lazare',
    label: 'Saint-Lazare',
  }, {
    value: 'monceau-ternes',
    label: 'Monceau - Ternes',
  }, {
    value: 'madeleine',
    label: 'Madeleine',
  }, {
    value: 'montmartre',
    label: 'Montmartre',
  }, {
    value: 'gare-du-nord',
    label: 'Gare du Nord',
  }, {
    value: 'canal-saint-martin',
    label: 'Canal Saint-Martin',
  }, {
    value: 'bastille',
    label: 'Bastille',
  }, {
    value: 'republique',
    label: 'République',
  }, {
    value: 'oberkampf',
    label: 'Oberkampf',
  }, {
    value: 'bercy',
    label: 'Bercy',
  }, {
    value: 'nation',
    label: 'Nation',
  }, {
    value: 'daumesnil',
    label: 'Daumesnil',
  }, {
    value: 'bibliotheque-nationale',
    label: 'Bibliothèque Nationale',
  }, {
    value: 'place-ditalie',
    label: 'Place ',
  }, {
    value: 'massena',
    label: 'Masséna',
  }, {
    value: 'monsouris',
    label: 'Monsouris',
  }, {
    value: 'alesia',
    label: 'Alesia',
  }, {
    value: 'montparnasse-denfert-rochereau',
    label: 'Montparnasse - Denfert Rochereau',
  }, {
    value: 'vaugirard',
    label: 'Vaugirard',
  }, {
    value: 'grenelle-javel',
    label: 'Grenelle - Javel',
  }, {
    value: 'champs-de-mars',
    label: 'Champs de Mars',
  }, {
    value: 'auteuil',
    label: 'Auteuil',
  }, {
    value: 'trocadero',
    label: 'Trocadéro',
  }, {
    value: '16e-arrondissement',
    label: '16e Arrondissement',
  }, {
    value: 'batignolles',
    label: 'Batignolles',
  }, {
    value: 'clichy-fourche',
    label: 'Clichy - Fourche',
  }, {
    value: 'goutte-dor',
    label: 'Goutte d\'Or',
  }, {
    value: 'clignancourt',
    label: 'Clignancourt',
  }, {
    value: 'vilette',
    label: 'Vilette',
  }, {
    value: 'buttes-chaumont',
    label: 'Buttes Chaumont',
  }, {
    value: 'belleville',
    label: 'Belleville',
  }, {
    value: 'pere-lachaise',
    label: 'Père Lachaise',
  }],
  montpellier: [{
    value: 'centre-historique-comedie',
    label: 'Centre Historique - Comédie',
  },{
    value: 'boutonnet',
    label: 'Boutonnet',
  },{
    value: 'beaux-arts',
    label: 'Beaux-Arts',
  },{
    value: 'aubes-pompignane',
    label: 'Aubes - Pompignane',
  },{
    value: 'antigone',
    label: 'Antigone',
  },{
    value: 'gares',
    label: 'Gares',
  },{
    value: 'gambetta',
    label: 'Gambetta',
  },{
    value: 'figuerolles',
    label: 'Figuerolles',
  },{
    value: 'les-arceaux',
    label: 'Les Arceaux',
  },{
    value: 'hopitaux-facultes',
    label: 'Hôpitaux - Facultés',
  },{
    value: 'aiguelongue',
    label: 'Aiguelongue',
  },{
    value: 'millenaire',
    label: 'Millénaire',
  },{
    value: 'port-marianne',
    label: 'Port-Marianne',
  },{
    value: 'aiguerelles',
    label: 'Aiguerelles',
  },{
    value: 'saint-martin',
    label: 'Saint-Martin',
  },{
    value: 'pres-darenes',
    label: 'Près d\'Arènes',
  },{
    value: 'estanove',
    label: 'Estanove',
  },{
    value: 'pas-du-loup',
    label: 'Pas du Loup',
  },{
    value: 'chamberte',
    label: 'Chamberte',
  }],
};

const captions = [{
  value: 'Cuisine',
  label: 'Cuisine',
}, {
  value: 'Salle de bain',
  label: 'Salle de bain',
}, {
  value: 'Hall',
  label: 'Hall',
}, {
  value: 'WC',
  label: 'WC',
}, {
  value: 'Balcon',
  label: 'Balcon',
}, {
  value: 'Terrasse',
  label: 'Terrasse',
}, {
  value: 'Jardin',
  label: 'Jardin',
}, {
  value: 'Loggia',
  label: 'Loggia',
}, {
  value: 'Séjour',
  label: 'Séjour',
}, {
  value: 'Salle à manger',
  label: 'Salle à manger',
}, {
  value: 'Immeuble',
  label: 'Immeuble',
}, {
  value: 'Garde-manger',
  label: 'Garder-manger',
}, {
  value: 'Dressing',
  label: 'Dressing',
}];


export default connect(mapStateToProps, mapDispatchToProps)(ApartmentDetails);
