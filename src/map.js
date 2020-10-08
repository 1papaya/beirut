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

import Tasks from "./data/tasks.geojson";
import InfoBox from "./components/infobox";
import BlastImg from "./img/blast.png";

import * as turfHelpers from "@turf/helpers";
import turfBuffer from "@turf/buffer";

import HotLogo from "./img/hot-logo.png";
import "mapbox-gl/dist/mapbox-gl.css";
import "./style.scss";

const Map = (props) => {
  let mapRef = React.createRef();

  let [isLoaded, setIsLoaded] = useState(false);

  let [sliderDate, setSliderDate] = useState(1596499200 * 1000);
  let [viewport, setViewport] = useState({
    longitude: 35.56641,
    latitude: 33.87526,
    zoom: 12.14,
    bearing: -6.7,
    pitch: 56,
  });

  // HOTTM Colors
  let mappedColor = "rgba(252, 236, 164, 0.9)";
  let validatedColor = "rgba(64, 172, 140, 0.9)";

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
    <>
      <MapGL
        {...viewport}
        ref={mapRef}
        width={"100%"}
        height={"100%"}
        mapOptions={{ hash: true }}
        onViewportChange={setViewport}
        mapStyle={BeirutStyle}
        onLoad={() => {
          setIsLoaded(true);
        }}
        transformRequest={(url) => {
          // modify data urls if the map is not hosted locally (development)

          let dataURL = new URL(url);
          let pageLoc = `${window.location.origin}${window.location.pathname}`;

          // if data URL is a localhost
          if (url.search("//localhost") >= 0) {
            // if current page has localhost in it, it's a dev server, no modify
            if (pageLoc.search("//localhost") >= 0) return;

            // if current page is not localhost, gonna have to rewrite
            if (pageLoc.search("//localhost") < 0)
              if (props.baseDataURL)
                return { url: `${props.baseDataURL}${dataURL.pathname}` };
              else return { url: `${pageLoc}${dataURL.pathname}` };
          }
        }}
      >
        {/* Controls */}
        <div style={{ position: "absolute", left: 10, top: 10 }}>
          <NavigationControl />
        </div>
        <Source id="explosion" type="geojson" data={explosion}>
          {sliderDate > 1596499200 * 1000 ? (
            <Layer
              beforeId="buildings-extruded"
              id="radiuses"
              type="fill"
              filter={["==", "$type", "Polygon"]}
              paint={{
                "fill-color": "#dd371b",
                "fill-opacity": 0.3,
              }}
            />
          ) : (
            <></>
          )}
        </Source>
        {sliderDate > 1596499200 * 1000 ? (
          <Marker anchor={"center"} longitude={35.518889} latitude={33.901389}>
            <img
              className="hover-pointer"
              src={BlastImg}
              style={{ transform: "translate(-50%, -50%) scale(-0.6, -0.6)" }}
            />
          </Marker>
        ) : (
          <></>
        )}
        <Source id="tasks" type="geojson" data={Tasks}>
          {sliderDate > 1596499200 * 1000 + 86400 * 1000 * 4 ? (
            <Layer
              beforeId="buildings-extruded"
              id="tasks"
              type="fill"
              paint={{
                "fill-color": [
                  "case",
                  [">=", sliderDate / 1000, ["get", "dateValidated"]],
                  validatedColor,
                  [
                    "all",
                    [">=", sliderDate / 1000, ["get", "dateMapped"]],
                    ["<", sliderDate / 1000, ["get", "dateValidated"]],
                  ],
                  mappedColor,
                  "rgba(255,255,255,0.5)",
                ],
              }}
            />
          ) : (
            <></>
          )}
        </Source>

        <Source
          id="buildings"
          type="vector"
          tiles={["http://localhost:8080/buildings/{z}/{x}/{y}.pbf"]}
        >
          <Layer
            id="buildings-extruded"
            type="fill-extrusion"
            source-layer="buildings"
            filter={[
              "all",
              [">=", sliderDate / 1000, ["get", "dateValidated"]],
            ]}
            paint={{
              "fill-extrusion-color": "rgba(0,0,0,0.8)",
              "fill-extrusion-height": 20,
              "fill-extrusion-base": 0,
              "fill-extrusion-opacity": 0.8,
            }}
          />
        </Source>
      </MapGL>
      <InfoBox onSliderChange={setSliderDate} />
      {!isLoaded && (
        <div className="loading">
          <div className="logo">
            <img src={HotLogo} />
            <div className="message">loading map...</div>
          </div>
        </div>
      )}
    </>
  );
};

Map.defaultProps = {};

export default Map;
