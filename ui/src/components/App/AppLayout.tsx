import React, { useEffect } from "react";
import { isRunningInElectron } from "../../utils/electron";
import Main from "../Main/Main";
import { useSockets } from "../shared/stores/SocketStore";
import { useTheme } from "../shared/stores/ThemeStore";
import Sidebar from "../Sidebar";
import Statusbar from "../Statusbar/Statusbar";
import Topbar from "../Topbar";
import DesktopMenu from "./DesktopMenu";
import { useConfig } from "../shared/stores/ConfigStore";
import * as Space from "react-spaces";

const isWindows = navigator.platform.toLowerCase() === "win32";

const AppLayout = React.memo(() => {
  const { theme } = useTheme();
  const { config } = useConfig();
  const { isSocketInitialized, initializeSocket } = useSockets();
  const topbarHeight = isRunningInElectron() && isWindows ? "30px" : "50px";
  const statusbarHeight = config?.showStatusBar ? "30px" : "0px";

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    try {
      initializeSocket();
    } catch (error) {
      console.error(`Error at starting socket`, error);
    }
  }, []);

  if (!isSocketInitialized || !config) {
    return null;
  }

  return (
    <React.Fragment>
      <Space.ViewPort className={theme}>
        <Space.Top size={topbarHeight}>
          {isRunningInElectron() && isWindows ? (
            <DesktopMenu />
          ) : (
            <Topbar data-testid="topbar" />
          )}
        </Space.Top>
        <Space.Fill>
          <Space.LeftResizable size="25%" minimumSize={100} maximumSize={400}>
            <Sidebar />
          </Space.LeftResizable>
          <Space.Fill>
            <Main />
          </Space.Fill>
        </Space.Fill>
        {config.showStatusBar ? (
          <Space.Bottom size={statusbarHeight}>
            <Statusbar />
          </Space.Bottom>
        ) : null}
      </Space.ViewPort>
    </React.Fragment>
  );
});

export default AppLayout;
