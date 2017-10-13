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
import { MAPBOX_TOKEN }       from '~/const';
import Utils                  from '~/utils';

import 'leaflet/dist/leaflet.css';

const _ = { filter };

const DEFAULT_ICON = new L.Icon({
  iconUrl: require('~/assets/search/map-marker-default.png'),
  iconSize: [45, 66],
});

const HIGHLIGHT_ICON = new L.Icon({
  iconUrl: require('~/assets/search/map-marker-highlight.png'),
  iconSize: [45, 66],
});

const MARKER_GROUP_OPTIONS = {
  iconCreateFunction(cluster) {
    return L.divIcon({
      className: 'map-rooms-cluster',
      html: (`
        <div data-count="${cluster.getChildCount()}">
          <img src="${require('~/assets/search/map-marker-cluster.png')}" />
        </div>
      `),
      iconSize: [45, 66],
    });
  },
  // We only want to cluster at the street address level.
  // that should do the trick
  maxClusterRadius: 1,
};

const DEFAULT_BBOX = [[51.089062, 9.55932], [41.33374, -5.1406]];
const tileLayerUrl =
  `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`;

class ResultsMap extends PureComponent {
  componentDidUpdate() {
    // Force l'actualisation de la carte si les propriétés sont mises à jour
    if (this._map) {
      this._map.leafletElement.invalidateSize();
    }
  }

  renderMarkers() {
    const { lang, highlightedRoomId, roomsArr } = this.props;

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
          <Room lang={lang} room={room} isThumbnail />
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
        scrollWheelZoom={false}
        attributionControl={false}
        maxZoom={15}
        ref={map => (this._map = map)}
      >
        <TileLayer
          url={tileLayerUrl}
          id="mapbox.streets"
          attribution={`
            © <a href="https://www.mapbox.com/about/maps/">Mapbox</a>
            © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>
            <strong>
              <a href="https://www.mapbox.com/map-feedback/"
                target="_blank"
              >
                Improve this map
              </a>
            </strong>`}
        />
        <MarkerClusterGroup
          wrapperOptions={{ enableDefaultStyle: false }}
          options={MARKER_GROUP_OPTIONS}
        >
          {this.renderMarkers()}
        </MarkerClusterGroup>
      </Map>
    );
  }
}

const mapStateToProps = (state, { hightlightedRoomId }) => {
  const { route: { lang }, rooms, apartments } = state;

  return {
    lang,
    roomsArr: _.filter(rooms, (room) => (typeof room === 'object')).map((room) => ({
      ...room,
      latLng: Utils.getApartmentLatLng(apartments[room.ApartmentId]),
      roomCount: apartments[room.ApartmentId].roomCount,
    })),
    hightlightedRoomId,
  };
};

export default connect(mapStateToProps)(ResultsMap);
