import React from "react";
import ReactDOM from "react-dom";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import Popup from "./Popup";

import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";

import "./styles.scss";
import { RecoilRoot } from "recoil";
import { ConfigProvider } from "./stores/ConfigStore.ext";
import { JobsProvider } from "./stores/JobStore.ext";
import { SocketsProvider } from "./stores/SocketStore.ext";
const queryCache = new QueryCache();

ReactDOM.render(
  <RecoilRoot>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ConfigProvider>
        <JobsProvider>
          <SocketsProvider>
            <Popup />
          </SocketsProvider>
        </JobsProvider>
      </ConfigProvider>
    </ReactQueryCacheProvider>
  </RecoilRoot>,
  document.getElementById("popup-root")
);
