import { PureComponent }      from 'react';
import _const                 from '~/const';
import Utils                  from '~/utils';

import 'leaflet/dist/leaflet.css';

const { MAPBOX_TOKEN } = _const;

const tileLayerUrl =
  `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`;

class SingleMap extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      libReactLeaflet: null,
      libLeaflet: null,
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
    }

  }

  componentDidUpdate() {
    // Force l'actualisation de la carte si les propriétés sont mises à jour
    if (this._map && this._map.leafletElement) {
      let map = this._map.leafletElement;

      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      if ( map.tap ) {
        map.tap.disable();
      }
      this._map.leafletElement.invalidateSize();
    }
  }

  render({ apartment }) {
    const latLng = Utils.getApartmentLatLng(apartment);

    if (this.state.libReactLeaflet === null || this.state.libLeaflet === null) {
      return <div>...</div>;
    }

    const { Map, TileLayer, Marker } = this.state.libReactLeaflet;
    const L = this.state.libLeaflet;
    const HIGHLIGHT_ICON = new L.Icon({
      iconUrl: require('~/assets/search/map-marker-highlight.png'),
      iconSize: [45, 66],
    });

    return (
      <Map
        style={{
          width: '100%',
          height: '400px',
          position: 'relative',
          overflow: 'hidden',
        }}
        center={latLng}
        scrollWheelZoom={false}
        maxZoom={17}
        className="single-map"
        zoom={12}
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
        <Marker
          position={latLng}
          icon={HIGHLIGHT_ICON}
        />
      </Map>
    );
  }
}

export default SingleMap;
