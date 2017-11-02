import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import { IntlProvider, Text } from 'preact-i18n';
import * as actions           from '~/actions';


class Pictures extends PureComponent {

  renderPicture({ url, alt, order }) {
    return (
      <div style="display:inline-block;position:relative;">
        <img src={url} alt={alt} style="max-height: 300px; max-width: 300px;" />
        <div style="color:#1C2B4A;position:absolute;left:50%;bottom:10px;transform: translate(-50%, -50%);">{alt}</div>
      </div>
    );
  }
  render() {
    const {
      lang,
      RoomPictures,
      ApartmentPictures,
    } = this.props;

    if ( ApartmentPictures === undefined && RoomPictures === undefined) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }
    const allPictures = [].concat(RoomPictures.sort((a, b) => a.order - b.order), ApartmentPictures.sort((a, b) => a.order - b.order));

    return (
      <IntlProvider definition={definition[lang]}>
        <section>
          <h3><Text id="title">Pictures</Text></h3>
          {allPictures.map((picture) => (
            this.renderPicture(picture)
          ))}
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
    apartment,
    RoomPictures: room && room.Pictures,
    ApartmentPictures: apartment && apartment.Pictures,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pictures);
