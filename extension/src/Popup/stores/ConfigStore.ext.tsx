import { captureException } from "@sentry/react";
import React from "react";

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { IConfig, TaskViewStyle } from "../../types";
import { getItem, setItem } from "../../common/storage.util";

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
      let port: string | number =
        getItem("port") || window.location.port || 5010;

      console.log("port:", port);
      if (process.env.NODE_ENV !== "production") {
        port = 5010;
      }
      setItem("port", port);
      const browserOnlyConfig: IConfig = {
        port,
        shell: "",
        sendErrorReports: false,
      };
      return browserOnlyConfig;
    } catch (error) {
      console.error(`Error getting config.`);
      captureException(error);
    }
  });

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

  return context;
}

export { ConfigProvider, useConfig };
