import React from "react";
import L from "leaflet";
import { Map, Marker, Popup, TileLayer, Polygon } from "react-leaflet";

import "./map.css";
//https://react-leaflet.js.org/docs/en/components.html#geojson

export default class MapComponent extends React.Component {
  renderPoint() {
    if (this.props.notice.POP_CONTIENT_GEOLOCALISATION !== "oui") {
      return <div />;
    }
    return (
      <Marker
        position={[
          this.props.notice.POP_COORDONNEES.lat,
          this.props.notice.POP_COORDONNEES.lon
        ]}
        icon={L.icon({
          iconUrl: require("../../../assets/marker-icon.png"),
          iconSize: [38, 55],
          iconAnchor: [22, 54],
          popupAnchor: [-3, -76],
          shadowUrl: require("../../../assets/marker-shadow.png"),
          shadowSize: [68, 55],
          shadowAnchor: [22, 54]
        })}
      >
        <Popup>
          <span>
            {this.props.notice.TICO}
            <br />
            {this.props.notice.DENO}
          </span>
        </Popup>
      </Marker>
    );
  }

  renderGeometry() {
    if (
      !this.props.notice.POP_COORDINATES_POLYGON ||
      !this.props.notice.POP_COORDINATES_POLYGON.coordinates.length
    ) {
      return <div />;
    }

    return (
      <Polygon
        color="purple"
        positions={this.props.notice.POP_COORDINATES_POLYGON.coordinates}
      />
    );
  }

  render() {
    let center = null;

    if (!this.props.notice) {
      return <div />;
    }

    const { POP_COORDONNEES, POP_COORDINATES_POLYGON } = this.props.notice;

    if (POP_COORDONNEES && POP_COORDONNEES.lat !== 0) {
      center = [
        this.props.notice.POP_COORDONNEES.lat,
        this.props.notice.POP_COORDONNEES.lon
      ];
    }

    if (
      POP_COORDINATES_POLYGON &&
      POP_COORDINATES_POLYGON.coordinates &&
      POP_COORDINATES_POLYGON.coordinates.length
    ) {
      center = POP_COORDINATES_POLYGON.coordinates[0];
    }

    if (!center) {
      return <div>Carte non disponible</div>;
    }

    console.log("CENTER", center);
    return (
      <div className="leaflet-container">
        <Map center={center} zoom={15}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {this.renderGeometry()}
          {this.renderPoint()}
        </Map>
      </div>
    );
  }
}
