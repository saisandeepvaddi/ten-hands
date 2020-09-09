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
  beforeSend(event) {
    // Modify the event here
    if (event.user) {
      // Don't send user's email address
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },
});

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    include: [/^CommandOutputXterm/],
  });
}

ReactDOM.render(
  <Sentry.ErrorBoundary fallback={"An error has occured"}>
    <App />
  </Sentry.ErrorBoundary>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
