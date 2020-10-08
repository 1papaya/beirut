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
      <div className="summary">
        <div className="heading">Disaster Background</div>
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
      </div>
      <div className="timeline">
        <div className="stats">
          <div className="stat">
            <div className="number">{(sliderValue - aug8) / daySec}</div>
            <div className="name">days since explosion</div>
          </div>
          <div className="stat">
            <div className="number">{sliderValue in Stats ? Stats[sliderValue]["num_bldg"] : 54155}</div>
            <div className="name">buildings mapped</div>
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
                }, 250)
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
    </div>
  );
};
