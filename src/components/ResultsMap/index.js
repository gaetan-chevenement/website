import { Component } from 'preact';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Room from '~/components/SearchResults/room';
import CSS from './style.css';

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

export default class ResultsMap extends Component {
  componentDidUpdate() {
    // Force l'actualisation de la carte si les propriétés sont mises à jour
    if (this._map) {
      this._map.leafletElement.invalidateSize();
    }
  }

  render() {
    const { rooms, data, highlightRoom } = this.props;
    let roomsCoordinates = rooms.map(room => {
      const aptId = room.relationships.Apartment.data.id;
      const apt = data.included.filter(i => i.id === aptId)[0];
      return {
        ll: apt.attributes.latLng.split(',').map(n => +n),
        room,
      };
    });

    let markers = roomsCoordinates.map(({ ll, room }) =>
      <Marker
        position={ll}
        icon={
          highlightRoom !== null && room.id === highlightRoom.id
            ? HIGHLIGHT_ICON
            : DEFAULT_ICON
        }
      >
        <Popup>
          <Room room={room} data={data} fromMap />
        </Popup>
      </Marker>,
    );

    let bounds;
    if (roomsCoordinates.length === 0) {
      bounds = DEFAULT_BBOX;
    } else {
      bounds = new L.LatLngBounds(roomsCoordinates.map(({ ll }) => ll)).pad(
        0.2,
      );
    }

    return (
      <Map
        style={{ width: '100%', height: '100%', position: 'relative' }}
        bounds={bounds}
        className={CSS.map}
        zoomControl={false}
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
          {markers}
        </MarkerClusterGroup>
      </Map>
    );
  }
}
