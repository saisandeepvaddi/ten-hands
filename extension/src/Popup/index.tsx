import React from "react";
import ReactDOM from "react-dom";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import Popup from "./Popup";
const queryCache = new QueryCache();

// import "@blueprintjs/core/lib/css/blueprint.css";
// import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import "./styles.scss";
import { RecoilRoot } from "recoil";

ReactDOM.render(
  <RecoilRoot>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Popup />
    </ReactQueryCacheProvider>
  </RecoilRoot>,
  document.getElementById("popup-root")
);
