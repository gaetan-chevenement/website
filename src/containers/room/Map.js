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
import _const                 from '~/const';
import Utils                  from '~/utils';

import 'leaflet/dist/leaflet.css';

const _ = { filter };
const { MAPBOX_TOKEN } = _const;


const HIGHLIGHT_ICON = new L.Icon({
  iconUrl: require('~/assets/search/map-marker-highlight.png'),
  iconSize: [45, 66],
});

const tileLayerUrl =
  `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`;

class SingleMap extends PureComponent {
  componentDidUpdate() {
    // Force l'actualisation de la carte si les propriétés sont mises à jour
    if (this._map) {
      this._map.leafletElement.invalidateSize();
    }
  }

  render() {

    console.log(apartment);


    const { apartment } = this.props;
    const latLng = Utils.getApartmentLatLng(apartment);

    console.log(latLng);

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
        attributionControl={false}
        maxZoom={15}
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
