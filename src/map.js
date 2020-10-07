import React, { useState, useEffect } from "react";
import MapGL, {
  ScaleControl,
  NavigationControl,
  FullscreenControl,
  Source,
  Layer,
  Marker,
} from "react-map-gl";
import BeirutStyle from "./style.json";

import InfoBox from "./components/infobox";
import BlastImg from "./img/blast.png";

import * as turfHelpers from "@turf/helpers";
import turfBuffer from "@turf/buffer";

import "mapbox-gl/dist/mapbox-gl.css";
import "./style.scss";

const Map = (props) => {
  let mapRef = React.createRef();

  let [viewport, setViewport] = useState({
    longitude: 35.5781,
    latitude: 33.9013,
    zoom: 11.52,
  });

  //
  // Generate Explosion Radiuses
  //

  let [explosion, setExplosion] = useState(turfHelpers.featureCollection([]));

  useEffect(() => {
    let epicenter = turfHelpers.point([35.518889, 33.901389], {
      id: "epicenter",
    });

    setExplosion(
      turfHelpers.featureCollection(
        [].concat(
          [epicenter],
          [2, 4, 8].map((radius) =>
            turfBuffer(epicenter, radius, { units: "kilometers" })
          )
        )
      )
    );
  }, []);

  return (
    <MapGL
      {...viewport}
      ref={mapRef}
      width={"100%"}
      height={"100%"}
      mapOptions={{ hash: true }}
      onViewportChange={setViewport}
      mapStyle={BeirutStyle}
    >
      {/* Controls */}
      <div style={{ position: "absolute", left: 10, top: 10 }}>
        <NavigationControl />
      </div>
      <InfoBox />
      <Source id="explosion" type="geojson" data={explosion}>
        <Layer id="epicenter" type="circle" filter={["==", "$type", "Point"]} />
        <Layer
          id="radiuses"
          type="fill"
          filter={["==", "$type", "Polygon"]}
          paint={{
            "fill-color": "#dd371b",
            "fill-opacity": 0.3
          }}
        />
      </Source>
      <Marker anchor={"center"} longitude={35.518889} latitude={33.901389}>
        <img
          src={BlastImg}
          style={{ transform: "translate(-50%, -50%) scale(-0.6, -0.6)" }}
        />
      </Marker>
    </MapGL>
  );
};

Map.defaultProps = {};

export default Map;
