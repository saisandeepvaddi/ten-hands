import { Classes } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import React from "react";
import SplitPane from "react-split-pane";
import io from "socket.io-client";
import styled from "styled-components";
import ApiProvider from "../utils/api";
import { ProjectsContext, SocketContext, ThemeContext } from "../utils/Context";
import { getItem, setItem } from "../utils/storage";
import Main from "./Main";
import Sidebar from "./Sidebar";
import "./styles/App.css";
import Topbar from "./Topbar";

const SplitContainer = styled.div`
    min-height: calc(100vh - 50px);
    padding-top: 50px;
    height: 100%;
    /* overflow: auto; */
`;

const App = () => {
    const [theme, setTheme] = React.useState(getItem("theme") || Classes.DARK);
    const [projects, setProjects] = React.useState([]);
    const [activeProject, setActiveProject] = React.useState({
        _id: "",
        name: "",
        type: "",
        commands: [],
    });

    const [socket, setSocket] = React.useState(() => {
        const socket = io("http://localhost:1010");
        return socket;
    });

    React.useEffect(() => {
        async function getProjectsFromApi() {
            const savedProjects: any = await ApiProvider.getAllProjects();
            setProjects(savedProjects);
            if (savedProjects) {
                // Set first project as default active project if there projects found
                setActiveProject(savedProjects[0]);
            }
        }
        getProjectsFromApi();
    }, []);

    React.useEffect(() => {
        setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={theme}>
            <ProjectsContext.Provider value={projects}>
                <SocketContext.Provider value={socket}>
                    <div className={theme}>
                        <Topbar theme={theme} setTheme={setTheme} />
                        <SplitContainer>
                            <SplitPane split="vertical" defaultSize={350} maxSize={500}>
                                <Sidebar setActiveProject={setActiveProject} />
                                <Main activeProject={activeProject} />
                            </SplitPane>
                        </SplitContainer>
                    </div>
                </SocketContext.Provider>
            </ProjectsContext.Provider>
        </ThemeContext.Provider>
    );
};

export default App;
