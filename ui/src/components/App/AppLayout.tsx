import React, { useEffect } from "react";
import SplitPane from "react-split-pane";
import io from "socket.io-client";
import styled from "styled-components";
import { isRunningInElectron } from "../../utils/electron";
import JobSocket from "../../utils/socket";
import Main from "../Main/Main";
import { useConfig } from "../shared/Config";
import { useTheme } from "../shared/Themes";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import DesktopMenu from "./DesktopMenu";

const AppLayout = React.memo(() => {
    const { config } = useConfig();
    const topbarHeight = isRunningInElectron() ? "30px" : "50px";
    useEffect(() => {
        try {
            const socket = io(`http://localhost:${config.port}`);
            console.log(config);
            JobSocket.bindSocket(socket);
        } catch (error) {
            console.error(`Error at starting socket`);
        }
    }, []);

    const { theme } = useTheme();

    return (
        <>
            <div className={theme}>
                {isRunningInElectron() ? <DesktopMenu /> : <Topbar data-testid="topbar" />}
                {/* <Topbar data-testid="topbar" /> */}
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
