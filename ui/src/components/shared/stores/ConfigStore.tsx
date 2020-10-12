import { captureException } from "@sentry/react";
import React from "react";

import { isRunningInElectron } from "../../../utils/electron";
import { getItem, setItem } from "../../../utils/storage";

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

interface IConfigContextValue {
  config: IConfig;
  setConfig: (config: IConfig) => void;
  changeConfigOption: <K extends keyof IConfig, V extends IConfig[K]>(
    key: K,
    value: V
  ) => void;
}

interface IConfigProviderProps {
  value?: IConfigContextValue;
  children: React.ReactNode;
}

export const ConfigContext = React.createContext<
  IConfigContextValue | undefined
>(undefined);

function ConfigProvider(props: IConfigProviderProps) {
  const [config, setConfig] = React.useState(() => {
    try {
      if (isRunningInElectron()) {
        const { ipcRenderer } = require("electron");
        const serverConfig = ipcRenderer.sendSync(`get-config`);
        console.log("serverConfig:", serverConfig);
        if (serverConfig.sendErrorReports) {
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
        }

        if (serverConfig) {
          return serverConfig;
        }
      } else {
        let port: string | number =
          getItem("port") || window.location.port || 5010;

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
    } catch (error) {
      console.error(`Error getting config.`);
      captureException(error);
    }
  });

  React.useEffect(() => {
    if (!isRunningInElectron()) {
      return;
    }

    const { ipcRenderer } = require("electron");
    ipcRenderer.on(`config-changed`, (e, newConfig) => {
      console.log("Config file updated:", newConfig);
      setConfig(newConfig);
    });
    return () => {
      ipcRenderer.removeListener(`config-changed`, () => {
        console.log(`config-changed listener removed`);
      });
    };
  }, []);

  const changeConfigOption = React.useCallback(
    <K extends keyof IConfig, V extends IConfig[K]>(key: K, value: V) => {
      const newConfig = {
        ...config,
        [key]: value,
      };
      setConfig(newConfig);
      //TODO: save new config
    },
    [config, setConfig]
  );

  const value = React.useMemo(() => {
    return { config, setConfig, changeConfigOption };
  }, [config, setConfig, changeConfigOption]);

  return <ConfigContext.Provider value={value} {...props} />;
}

function useConfig() {
  const context = React.useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }

  return context;
}

export { ConfigProvider, useConfig };
