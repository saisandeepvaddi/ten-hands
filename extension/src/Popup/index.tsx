import React from "react";
import ReactDOM from "react-dom";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import Popup from "./Popup";
const queryCache = new QueryCache();

ReactDOM.render(
  <ReactQueryCacheProvider queryCache={queryCache}>
    <Popup />
  </ReactQueryCacheProvider>,
  document.getElementById("popup-root")
);
