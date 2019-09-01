import React, { useEffect } from "react";
import SplitPane from "react-split-pane";
import { isRunningInElectron } from "../../utils/electron";
import Main from "../Main/Main";
import { useSockets } from "../shared/Sockets";
import { useTheme } from "../shared/Themes";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import DesktopMenu from "./DesktopMenu";

const isWindows = navigator.platform.toLowerCase() === "win32";

const AppLayout = React.memo(() => {
    const { theme } = useTheme();
    const { isSocketInitialized, initializeSocket } = useSockets();
    const topbarHeight = isRunningInElectron() ? "30px" : "50px";

    useEffect(() => {
        try {
            initializeSocket();
        } catch (error) {
            console.error(`Error at starting socket`, error);
        }
    }, []);

    if (!isSocketInitialized) {
        return null;
    }

    return (
        <>
            <div className={theme}>
                {/* New menubar is only for Windows in this release :( */}
                {isRunningInElectron() && isWindows ? <DesktopMenu /> : <Topbar data-testid="topbar" />}
                <div
                    style={{
                        minHeight: `calc(100vh - ${topbarHeight})`,
                        paddingTop: `${topbarHeight}`,
                    }}
                >
                    <SplitPane data-testid="splitPane" split="vertical" defaultSize={350} maxSize={500}>
                        <Sidebar data-testid="sidebar" />
                        <Main data-testid="main" />
                    </SplitPane>
                </div>
            </div>
        </>
    );
});

export default AppLayout;
