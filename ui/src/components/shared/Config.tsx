import React from "react";

import { isRunningInElectron } from "../../utils/electron";
import { getItem } from "../../utils/storage";

interface IConfig {
    port: string | number;
}

interface IConfigContextValue {
    config: IConfig;
    setConfig: (config: IConfig) => void;
}

interface IConfigProviderProps {
    value?: IConfigContextValue;
    children: React.ReactNode;
}

export const ConfigContext = React.createContext<IConfigContextValue | undefined>(undefined);

function ConfigProvider(props: IConfigProviderProps) {
    const [config, setConfig] = React.useState(() => {
        try {
            if (isRunningInElectron()) {
                const { ipcRenderer } = require("electron");
                const serverConfig = ipcRenderer.sendSync(`get-config`);
                if (serverConfig) {
                    return serverConfig;
                }
            } else {
                return {
                    port: getItem("port") || 1010,
                };
            }
        } catch (error) {
            console.error(`Error getting config.`);
        }
    });

    const value = React.useMemo(() => {
        return { config, setConfig };
    }, [config]);

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
        setConfig,
    };
}

export { ConfigProvider, useConfig };
