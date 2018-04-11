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
import orderBy                from 'lodash/orderBy';
import Room                   from '~/components/search/Room';
import _const                 from '~/const';
import Utils                  from '~/utils';

import 'leaflet/dist/leaflet.css';

const _ = { filter, orderBy };
const { MAPBOX_TOKEN } = _const;

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
    if ( this._map ) {
      this._map.leafletElement.invalidateSize();
    }
  }

  render({ lang, highlightedRoomId, arrRooms }) {
    const bounds = arrRooms.length > 0 ?
      new L.LatLngBounds( arrRooms.map(({ latLng }) => (latLng)) ).pad(0.2) :
      DEFAULT_BBOX;

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
          {arrRooms.map((room) => (
            <MarkerWrapper
              lang={lang}
              room={room}
              icon={room.id === highlightedRoomId ? HIGHLIGHT_ICON : DEFAULT_ICON}
            />
          ))}
        </MarkerClusterGroup>
      </Map>
    );
  }
}

function MarkerWrapper({ lang, room, icon }) {
  return (
    <Marker position={room.latLng} icon={icon}>
      <Popup>
        <Room lang={lang} room={room} isThumbnail />
      </Popup>
    </Marker>
  );
}

const mapStateToProps = (state, { hightlightedRoomId }) => {
  const { route: { lang }, rooms, apartments } = state;

  return {
    lang,
    arrRooms: _.orderBy(rooms, ['availableAt'])
      .filter((room) => typeof room === 'object')
      .map((room) => ({
        ...room,
        latLng: Utils.getApartmentLatLng(apartments[room.ApartmentId]),
        roomCount: apartments[room.ApartmentId].roomCount,
        pictures: [].concat(
          Utils.getPictures(room),
          Utils.getPictures(apartments[room.ApartmentId])
        ),
      })),
    hightlightedRoomId,
  };
};

export default connect(mapStateToProps)(ResultsMap);
