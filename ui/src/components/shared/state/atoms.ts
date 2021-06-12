import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { atom } from "recoil";

import { isRunningInElectron } from "../../../utils/electron";
import { getItem, setItem } from "../../../utils/storage";

export const activeProjectAtom = atom<IProject>({
  key: "activeProject",
  default: {
    _id: "",
    name: "",
    type: "",
    path: "",
    shell: "",
    configFile: "",
    taskSortOrder: "name-asc",
    commands: [],
  },
});

export const projectsAtom = atom<IProject[]>({
  key: "projects",
  default: [],
});

function getConfig(): IConfig {
  if (isRunningInElectron()) {
    const { ipcRenderer } = require("electron");
    const serverConfig: IConfig = ipcRenderer.sendSync(`get-config`);
    console.log("serverConfig:", serverConfig);
    if (serverConfig.sendErrorReports) {
      Sentry.init({
        dsn: "https://cf85249eefb245d1a01fe81e2a425e5f@o443842.ingest.sentry.io/5418370",
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
    }
    return serverConfig;
  } else {
    let port: string | number = getItem("port") || window.location.port || 5010;

    console.log("port:", port);
    if (process.env.NODE_ENV !== "production") {
      port = 5010;
    }
    setItem("port", port);
    const browserOnlyConfig: IConfig = {
      port,
      enableTerminalTheme: Boolean(getItem("enableTerminalTheme")) || true,
      showStatusBar: Boolean(getItem("showStatusBar")) || true,
      taskViewStyle: (getItem("taskViewStyle") as TaskViewStyle) || "tabs",
      shell: "",
      sendErrorReports: false,
    };
    return browserOnlyConfig;
  }
}

export const configAtom = atom<IConfig>({
  key: "config",
  default: getConfig(),
});
