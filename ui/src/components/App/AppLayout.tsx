import React, { useEffect } from "react";
import SplitPane from "react-split-pane";
import io from "socket.io-client";
import styled from "styled-components";
import JobSocket from "../../utils/socket";
import Main from "../Main/Main";
import { useTheme } from "../shared/Themes";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

const SplitContainer = styled.div`
    min-height: calc(100vh - 50px);
    padding-top: 50px;
`;

const AppLayout = React.memo(() => {
    useEffect(() => {
        const socket = io("http://localhost:1010");
        JobSocket.bindSocket(socket);
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
