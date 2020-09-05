import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import App from "./components/App";

import "./index.css";
import * as serviceWorker from "./serviceWorker";

Sentry.init({
  dsn:
    "https://cf85249eefb245d1a01fe81e2a425e5f@o443842.ingest.sentry.io/5418370",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    include: [/^CommandOutputXterm/],
  });
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
