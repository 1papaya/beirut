import React from "react";

import "fontsource-barlow-condensed/latin-400-normal.css";
import "fontsource-archivo/latin-400-normal.css";

import HotLogo from "../img/hot-logo.png";

export default (props) => {
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
            (source: <a href="https://en.wikipedia.org/wiki/2020_Beirut_explosion">wikipedia</a>)
        </div>
      </div>
    </div>
  );
};
