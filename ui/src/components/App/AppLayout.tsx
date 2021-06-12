import { captureException } from "@sentry/react";
import debounce from "lodash/debounce";
import React, { useEffect } from "react";
import * as Space from "react-spaces";
import { useRecoilState, useRecoilValue } from "recoil";

import { isRunningInElectron } from "../../utils/electron";
import { setItem } from "../../utils/storage";
import Main from "../Main/Main";
import { configAtom } from "../shared/state/atoms";
import { siderWidthAtom } from "../shared/state/layout";
import { useSockets } from "../shared/stores/SocketStore";
import { useTheme } from "../shared/stores/ThemeStore";
import Sidebar from "../Sidebar";
import Statusbar from "../Statusbar/Statusbar";
import Topbar from "../Topbar";
import DesktopMenu from "./DesktopMenu";

const isWindows = navigator.platform.toLowerCase() === "win32";

const AppLayout = React.memo(() => {
  const { theme } = useTheme();
  // const { config } = useConfig();
  const config = useRecoilValue(configAtom);
  const { isSocketInitialized, initializeSocket } = useSockets();
  const topbarHeight = isRunningInElectron() && isWindows ? "30px" : "50px";
  const statusbarHeight = config?.showStatusBar ? "30px" : "0px";
  const [siderWidth, setSiderWidth] = useRecoilState(siderWidthAtom);

  useEffect(() => {
    try {
      initializeSocket();
    } catch (error) {
      captureException(error);
      console.error(`Error at starting socket`, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateSiderWidthAtom = React.useCallback(
    debounce((newSize) => {
      setSiderWidth(newSize);
    }, 200),
    [setSiderWidth]
  );

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
          <Space.LeftResizable
            size={siderWidth ?? 300}
            minimumSize={100}
            maximumSize={600}
            onResizeEnd={(newSize) => {
              // Save siderWidth in global so that we can use to show small/large icons in siderbar
              updateSiderWidthAtom(newSize);
              setItem("sider-width", newSize);
            }}
          >
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
