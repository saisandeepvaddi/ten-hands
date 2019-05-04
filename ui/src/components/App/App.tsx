import { Classes } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import React, { useEffect, useState } from "react";
import SplitPane from "react-split-pane";
import io from "socket.io-client";
import styled from "styled-components";
import { useApi } from "../../utils/api";
import { ProjectsContext, ThemeContext } from "../../utils/Context";
import JobSocket from "../../utils/socket";
import { getItem, setItem } from "../../utils/storage";
import Main from "../Main/Main";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import "./App.css";

const SplitContainer = styled.div`
    min-height: calc(100vh - 50px);
    padding-top: 50px;
`;

const App = () => {
    const [theme, setTheme] = useState(getItem("theme") || Classes.DARK);
    // const [projects, setProjects] = useState([]);
    const { data: projects } = useApi("projects");
    const [activeProject, setActiveProject] = useState({
        _id: "",
        name: "",
        type: "",
        commands: [],
    });

    useEffect(() => {
        const socket = io("http://localhost:1010");
        JobSocket.bindSocket(socket);
    }, []);

    useEffect(() => {
        if (projects.length > 0) {
            setActiveProject(projects[0]);
        }
    }, [projects]);

    useEffect(() => {
        setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={theme}>
            <ProjectsContext.Provider value={projects}>
                <div className={theme}>
                    <Topbar theme={theme} setTheme={setTheme} />
                    <SplitContainer>
                        <SplitPane split="vertical" defaultSize={350} maxSize={500}>
                            <Sidebar setActiveProject={setActiveProject} />
                            <Main activeProject={activeProject} />
                        </SplitPane>
                    </SplitContainer>
                </div>
            </ProjectsContext.Provider>
        </ThemeContext.Provider>
    );
};

export default App;
