import React from "react";

import { isRunningInElectron } from "../../../utils/electron";
import { getItem, setItem } from "../../../utils/storage";

interface IConfigContextValue {
  config: IConfig;
  setConfig: (config: IConfig) => void;
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
        if (serverConfig) {
          return serverConfig;
        }
      } else {
        const port = window.location.port || getItem("port") || 5010;
        setItem("port", port);
        const browserOnlyConfig: IConfig = {
          port,
          enableTerminalTheme: Boolean(getItem("enableTerminalTheme")) || true,
          showStatusBar: Boolean(getItem("showStatusBar")) || true
        };
        return browserOnlyConfig;
      }
    } catch (error) {
      console.error(`Error getting config.`);
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

  const value = React.useMemo(() => {
    return { config, setConfig };
  }, [config, setConfig]);

  return <ConfigContext.Provider value={value} {...props} />;
}

function useConfig() {
  const context = React.useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }

  const { config, setConfig } = context;

  return {
    config,
    setConfig
  };
}

export { ConfigProvider, useConfig };
