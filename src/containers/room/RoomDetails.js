import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import uuid                   from 'uuid/v4';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { Input }              from 'react-toolbox/lib/input';
import { Checkbox }           from 'react-toolbox/lib/checkbox';
import { IconButton }         from 'react-toolbox/lib/button';
import { batch }              from 'redux-act';
import Dropzone               from 'react-dropzone';
import capitalize             from 'lodash/capitalize';
import Promise                from 'bluebird';
import { Dropdown }           from 'react-toolbox/lib/dropdown';
import { IntlProvider, Text } from 'preact-i18n';
import autobind               from 'autobind-decorator';
import * as actions           from '~/actions';

const _ = { capitalize };
class RoomDetails extends PureComponent {
  @autobind
  handleChange(value, event) {
    const { actions, roomId: id } = this.props;
    value = event.target.name === 'basePrice' ? value * 100 : value ;
    event.target.name === 'floorArea' && value < 10 ?
      actions.addRoomFeature({ name: 'small', taxonomy: 'room-features-negative', termable: 'Room', TermableId: id }) :
      actions.deleteRoomFeature({ name: 'small', taxonomy: 'room-features-negative', termable: 'Room', TermableId: id });
    batch(
      actions.updateRoom({ [event.target.name]: value, id }),
      actions.deleteRoomError(event.target.name)
    );
  }

  @autobind
  handlePictureChange(event) {
    const { actions, room, roomId: id } = this.props;
    const picture = {
      order: event.target.value,
      picturable: event.target.getAttribute('picturable'),
      id: event.target.getAttribute('pictureId'),
      PicturableId: id,
      alt: _.capitalize(room.name.split('-')[1].trim()),
    };
    batch(
      actions.updateRoomPicture({ picture, id }),
      actions.deleteRoomError(event.target.name),
    );
  }

  @autobind
  handlePictureDelete(event) {
    const { actions, roomId: id } = this.props;
    const picture = {
      PicturableId: id,
      id: event.target.getAttribute('pictureId'),
    };
    actions.deleteRoomPicture(picture);
  }
  @autobind
  onDrop(acceptedFiles, rejectedFiles) {
    const { actions, roomId, room } = this.props;
    Promise.mapSeries(acceptedFiles, (file) => {
      const reader = new FileReader();
      reader.onload = () => {
        actions.addRoomPicture({
          url: reader.result,
          picturable: 'Room',
          PicturableId: roomId,
          id: uuid(),
          alt: _.capitalize(room.name.split('-')[1].trim()),
        });
      };
      reader.readAsDataURL(file);
    });
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
      room: { Pictures },
      getPictures,
      rooms: { errors },
    } = this.props;

    if ( !room || getFeatures === undefined || getPictures === undefined ) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }
    return (
      <IntlProvider definition={definition[lang]}>
        <section>
          <h2 style="text-align:center;"><Text id="title">Details for room</Text> - {room.name}</h2>
          <Input type="number"
            label={<Text id="basePrice">Base Price</Text>}
            name="basePrice"
            required
            value={room.basePrice /100}
            onChange={this.handleChange}
            error={errors && errors.basePrice}
          />
          <Input type="number"
            label={<Text id="floorArea">Surface</Text>}
            name="floorArea"
            required
            value={room.floorArea}
            onChange={this.handleChange}
            error={errors && errors.floorArea}
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
              {Pictures.sort((a,b) => a.order - b.order).map((picture) =>
                (
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
                      picturable="Room"
                      required
                      pictureId={picture.id}
                      value={picture.order}
                      onBlur={this.handlePictureChange}
                      error={errors && errors.order}
                    />
                  </div>
                )
              )}</dl>
          </div>
          <h3 style="text-align:center;"><Text id="negativeTitle">Negative Features</Text></h3>
          <br />
          <ul class="grid-4 has-gutter-l">
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
          </ul>

        </section>
      </IntlProvider>
    );
  }
}

function mapStateToProps({ route: { lang, admin }, rooms, apartments }, { roomId }) {
  const room = rooms[roomId];

  return {
    lang,
    admin,
    room,
    rooms,
    roomId,
    getPictures: room && room.Pictures && room.Pictures.length > 0,
    getFeatures: room && room.Features && room.Features.length > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

const definition = { 'fr-FR': {
  title: 'Détails de la chambre',
  basePrice: 'Prix de Base',
  floorArea: 'Surface',
  beds: 'Type de Litterie',
  description: {
    title: 'Descriptions',
    fr: 'description française',
    en: 'description anglaise',
    es: 'description espagnole',
  },
  negativeTitle: 'Points Négatifs',
  picture: {
    title: 'Télécharger des photos',
    hint: {
      first: 'Déposez des fichiers, ou cliquez pour télécharger des fichiers.',
      second: 'Seulement des images *.jpeg ou *.jpg',
    },
    order: 'Ordre',
  },
} };


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

export default connect(mapStateToProps, mapDispatchToProps)(RoomDetails);
