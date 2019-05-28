import Axios from "axios";
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

const SplitContainer = styled.div`
    min-height: calc(100vh - 50px);
    padding-top: 50px;
`;

const AppLayout = React.memo(() => {
    const { config } = useConfig();
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
        <div className={theme}>
            <Topbar />
            <SplitContainer>
                <SplitPane split="vertical" defaultSize={350} maxSize={500}>
                    <Sidebar />
                    <Main />
                </SplitPane>
            </SplitContainer>
        </div>
    );
});

export default AppLayout;
