import React, { useState, useEffect } from "react";
import Slider from "rc-slider";

import { FaPlayCircle, FaStopCircle } from "react-icons/fa";

import "fontsource-barlow-condensed/latin-400-normal.css";
import "fontsource-archivo/latin-400-normal.css";

import "rc-slider/assets/index.css";

import Stats from "../data/stats.json";

import HotLogo from "../img/hot-logo.png";

export default (props) => {
  let aug8 = 1596499200 * 1000;
  let sep23 = 1600819200 * 1000;
  let daySec = 86400 * 1000;

  let [sliderValue, setSliderValue] = useState(aug8);
  useEffect(() => {
    if (sliderValue > sep23) {
      clearInterval(sliderInterval);
      setSliderInterval(null);
    }
    props.onSliderChange(sliderValue);
  }, [sliderValue]);

  let [sliderInterval, setSliderInterval] = useState(null);

  let [marks, setMarks] = useState({});
  useEffect(() => {
    setMarks(
      Object.assign(
        {},
        ...[0, 10, 20, 30, 40, 50].map((day) => {
          let newDay = aug8 + day * daySec;
          let label = (
            <>{new Date(newDay).toDateString().substr(4).substr(0, 6)}</>
          );

          return {
            [newDay]: {
              style: {
                whiteSpace: "nowrap",
                fontSize: "0.8rem",
              },
              label: label,
            },
          };
        })
      )
    );
  }, []);

  return (
    <div className="infobox">
      <div className="title">
        <img src={HotLogo} />
        2020 Beirut Explosion Response
      </div>
      <div className="timeline">
        <div className="stats">
          <div className="stat">
            <div className="number">{(sliderValue - aug8) / daySec}</div>
            <div className="name">days since explosion</div>
          </div>
          <div className="stat">
            <div className="number">
              {sliderValue in Stats ? Stats[sliderValue]["num_bldg"] : 54155}
            </div>
            <div className="name">buildings mapped*</div>
          </div>
          <div className="stat">
            <div className="number percent">
              {sliderValue in Stats ? Stats[sliderValue]["pct_mapped"] : 100}
            </div>
            <div className="name">tasks mapped</div>
          </div>
          <div className="stat">
            <div className="number percent">
              {sliderValue in Stats ? Stats[sliderValue]["pct_validated"] : 100}
            </div>
            <div className="name">tasks validated</div>
          </div>
        </div>
        <div
          className="play"
          onClick={() => {
            if (sliderInterval === null) {
              setSliderInterval(
                setInterval(() => {
                  setSliderValue((sliderValue) => sliderValue + daySec);
                }, 1000)
              );
            } else {
              clearInterval(sliderInterval);
              setSliderInterval(null);
            }
          }}
        >
          {sliderInterval === null ? (
            <FaPlayCircle
              style={{ height: "30px", width: "30px", fill: "#dd371b" }}
            />
          ) : (
            <FaStopCircle
              style={{ height: "30px", width: "30px", fill: "#dd371b" }}
            />
          )}
        </div>
        <div className="slider">
          <Slider
            value={sliderValue}
            min={aug8}
            max={sep23}
            marks={marks}
            step={daySec}
            onChange={setSliderValue}
            onAfterChange={(e) => {
              clearInterval(sliderInterval);
            }}
          />
        </div>
      </div>
      <Summary heading={"Map Information"}>
        <div className="text">
          This is an online interactive map of the Humanitarian OpenStreetMap
          Team's disaster activation response to the 2020 Beirut Explosion.
          Press the red play button above to visualize the event and coordinated
          disaster response.
          <div className="legend">
            Legend:{" "}
            <span
              className="color"
              style={{ backgroundColor: "rgba(252, 236, 164, 1)" }}
            ></span>
            Validated Task{" "}
            <span
              className="color"
              style={{ backgroundColor: "rgba(64, 172, 140, 1)" }}
            ></span>
            Mapped Task{" "}
            <span className="color" style={{ backgroundColor: "#000" }}></span>
            Added Building*
          </div>
          <div className="footnote">
            * buildings number is an estimate which assumes all buildings
            present in each task square were added during HOT campaign.
          </div>
        </div>
      </Summary>
      <Summary heading={"Disaster Background"}>
        <div className="text">
          On 4 August 2020, a large amount of ammonium nitrate stored at the
          port of the city of Beirut, the capital of Lebanon, exploded, causing
          at least 200 deaths, 6,500 injuries, and US$15 billion in property
          damage, and leaving an estimated 300,000 people homeless.
        </div>
        <div className="source">
          (source:{" "}
          <a href="https://en.wikipedia.org/wiki/2020_Beirut_explosion">
            wikipedia
          </a>
          )
        </div>
      </Summary>
      <Summary heading={"HOT Response"}>
        <div className="text">
          On 9 August 2020, the Lebanese Red Cross, after determining verifiable
          damage had been reported as far as 24 kilometers from the epicenter of
          the explosion, made a request of HOT to organize the mapping of Beirut
          out to roughly 8 kilometers away from the port.
        </div>
        <div className="source">
          (source:{" "}
          <a href="https://wiki.openstreetmap.org/wiki/2020_Beirut_Port_Explosion">
            OSM wiki
          </a>
          )
        </div>
      </Summary>
      <Summary heading={"More Information"}>
        <div className="text">
          All data contributed to HOT Disaster Responses is available for free from
          OpenStreetMap under the very permissive and open ODbL license. For the
          most up-to-date copy of the data, it is available for{" "}
          <a href="https://download.geofabrik.de/asia/lebanon.html">
            download from GeoFabrik
          </a>{" "}
          or from the{" "}
          <a href="https://export.hotosm.org/en/v3/">HOT Export Tool</a>
        </div>
        <div className="source">
          (source:{" "}
          <a href="https://wiki.openstreetmap.org/wiki/2020_Beirut_Port_Explosion">
            OSM wiki
          </a>
          )
        </div>
      </Summary>
    </div>
  );
};

let Summary = (props) => {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <div className="summary">
      <div
        className="heading"
        style={{
          textDecoration: isOpen ? "underline" : "none",
          marginBottom: isOpen ? "0.35em" : "0",
        }}
      >
        {props.heading}
        <div className="closeopen" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "close" : "open"}
        </div>
      </div>
      {isOpen && props.children}
    </div>
  );
};
