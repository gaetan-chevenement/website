import { h }                  from 'preact';
import { PureComponent }      from 'react';
import { connect }            from 'react-redux';
import {
  Map,
  TileLayer,
  Marker,
  Popup,
}                             from 'react-leaflet';
import L                      from 'leaflet';
import MarkerClusterGroup     from 'react-leaflet-markercluster';
import filter                 from 'lodash/filter';
import Room                   from '~/containers/search/Room';
import Utils                  from '~/utils';
import style                  from './style.css';

const _ = { filter };

const DEFAULT_ICON = new L.Icon({
  iconUrl: require('~/assets/search/map-marker-default.png'),
  iconSize: [45, 67],
});

const HIGHLIGHT_ICON = new L.Icon({
  iconUrl: require('~/assets/search/map-marker-highlight.png'),
  iconSize: [45, 67],
});

const MARKER_GROUP_OPTIONS = {
  iconCreateFunction(cluster) {
    return L.divIcon({
      html: '<div>' + cluster.getChildCount() + '</div>',
      className: 'map-rooms-cluster',
      iconSize: [46, 46],
    });
  },
};

const DEFAULT_BBOX = [[51.089062, 9.55932], [41.33374, -5.1406]];

class ResultsMap extends PureComponent {
  componentDidUpdate() {
    // Force l'actualisation de la carte si les propriétés sont mises à jour
    if (this._map) {
      this._map.leafletElement.invalidateSize();
    }
    setInterval(this._map.leafletElement.invalidateSize, 1000);
  }

  renderMarkers() {
    const { highlightedRoomId, roomsArr } = this.props;

    return roomsArr.map((room) => (
      <Marker
        position={room.latLng}
        icon={
          highlightedRoomId !== null && room.id === highlightedRoomId
            ? HIGHLIGHT_ICON
            : DEFAULT_ICON
        }
      >
        <Popup>
          <Room room={room} data={room} fromMap />
        </Popup>
      </Marker>
    ));
  }

  render() {
    const { roomsArr } = this.props;
    let bounds;

    if (roomsArr.length === 0) {
      bounds = DEFAULT_BBOX;
    }
    else {
      bounds = new L.LatLngBounds(
        roomsArr.map(({ latLng }) => (latLng))
      ).pad(0.2);
    }

    return (
      <Map
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
        bounds={bounds}
        className={style.map}
        scrollWheelZoom={false}
        attributionControl={false}
        maxZoom={15}
        ref={map => (this._map = map)}
      >
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <MarkerClusterGroup
          wrapperOptions={{ enableDefaultStyle: false, maxClusterRadius: 0 }}
          options={MARKER_GROUP_OPTIONS}
        >
          {this.renderMarkers()}
        </MarkerClusterGroup>
      </Map>
    );
  }
}

const mapStateToProps = ({ rooms, apartments }, { hightlightedRoomId }) => (console.log(rooms), {
  roomsArr: _.filter(rooms, (room) => (typeof room === 'object')).map((room) => ({
    ...room,
    latLng: Utils.getApartmentLatLng(apartments[room.ApartmentId]),
  })),
  hightlightedRoomId,
});

export default connect(mapStateToProps)(ResultsMap);
