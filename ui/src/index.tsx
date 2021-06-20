import "./index.css";

import * as Sentry from "@sentry/react";
import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

// if (process.env.NODE_ENV === "development") {
//   const whyDidYouRender = require("@welldone-software/why-did-you-render");
//   whyDidYouRender(React, {
//     include: [/^CommandOutputXterm/],
//   });
// }

ReactDOM.render(
  <Sentry.ErrorBoundary fallback={"An error has occured"}>
    <App />
  </Sentry.ErrorBoundary>
  ,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
