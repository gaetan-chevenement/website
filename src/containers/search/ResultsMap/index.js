import { Component }          from 'react';
import filter                 from 'lodash/filter';
import orderBy                from 'lodash/orderBy';
import Room                   from '~/components/search/Room';
import _const                 from '~/const';
import Utils                  from '~/utils';
import { connect }            from 'react-redux';

import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

const _ = { filter, orderBy };
const { MAPBOX_TOKEN } = _const;

// We only want to cluster at the street address level.
// that should do the trick
const maxClusterRadius = 1;

function iconCreateFunctionUnbound(L, cluster) {
  return L.divIcon({
    className: 'map-rooms-cluster',
    html: (`
      <div data-count="${cluster.getChildCount()}">
        <img src="${require('~/assets/search/map-marker-cluster.png')}" />
      </div>
    `),
    iconSize: [45, 66],
  });
}

const DEFAULT_BBOX = [[51.089062, 9.55932], [41.33374, -5.1406]];
const tileLayerUrl =
  `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`;

class ResultsMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      libReactLeaflet: null,
      libLeaflet: null,
      libReactLeafletMarkerCluster: null,
    };

    if (typeof window === 'object') {
      import('react-leaflet')
        .then(reactLeaflet => {
          this.setState({
            libReactLeaflet: reactLeaflet,
          });
          return true;
        })
        .catch(() => {
          console.error('leaflet loading failed');
        });
      import('leaflet')
        .then(leaflet => {
          this.setState({
            libLeaflet: leaflet,
          });
          return true;
        })
        .catch(() => {
          console.error('leaflet loading failed');
        });
      import('react-leaflet-markercluster')
        .then(reactLeafletMarkerCluster => {
          this.setState({
            libReactLeafletMarkerCluster: reactLeafletMarkerCluster,
          });
          return true;
        })
        .catch(() => {
          console.error('leaflet loading failed');
        });
    }
  }

  // invalidate the size of the map every time it has been re-rendered
  componentDidUpdate() {
    if ( this._map && this._map.leafletElement) {
      this._map.leafletElement.invalidateSize();
    }
  }

  render({ lang, arrivalDate, highlightedRoomId, arrRooms }) {
    if (this.state.libReactLeaflet === null || this.state.libLeaflet === null ||
      this.state.libReactLeafletMarkerCluster === null
    ) {
      return <div>...</div>;
    }

    const L = this.state.libLeaflet;
    const MarkerClusterGroup = this.state.libReactLeafletMarkerCluster.default;

    const bounds = arrRooms.length > 0 ?
      new L.LatLngBounds( arrRooms.map(({ latLng }) => (latLng)) ).pad(0.2) :
      DEFAULT_BBOX;

    const { Map, TileLayer, Marker, Popup } = this.state.libReactLeaflet;

    const DEFAULT_ICON = new L.Icon({
      iconUrl: require('~/assets/search/map-marker-default.png'),
      iconSize: [45, 66],
    });

    const HIGHLIGHT_ICON = new L.Icon({
      iconUrl: require('~/assets/search/map-marker-highlight.png'),
      iconSize: [45, 66],
    });

    const iconCreateFunction = iconCreateFunctionUnbound.bind(null, L);

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
        maxZoom={17}
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
        <MarkerClusterGroup {...{ maxClusterRadius, iconCreateFunction }}
          ref={(markerClusterGroup) => {
            this.markerClusterGroup = markerClusterGroup;
          }}
        >
          { // Leaflet doesn't like it when we move Marker outside of this render
            arrRooms.map((room) => (
              <Marker
                position={room.latLng}
                icon={room.id === highlightedRoomId ? HIGHLIGHT_ICON : DEFAULT_ICON}
              >
                <Popup>
                  <Room {...{ lang, arrivalDate, room }} isThumbnail />
                </Popup>
              </Marker>
            ))
          }
        </MarkerClusterGroup>
      </Map>
    );
  }
}

const mapStateToProps = (state, { hightlightedRoomId }) => {
  const { route: { lang, date }, rooms, apartments } = state;

  return {
    lang,
    arrivalDate: date,
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
