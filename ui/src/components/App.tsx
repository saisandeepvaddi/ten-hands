import { Classes } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import React from "react";
import SplitPane from "react-split-pane";
import styled from "styled-components";
import { getProjects } from "../utils/api";
import { ProjectsContext, ThemeContext } from "../utils/Context";
import { getItem, setItem } from "../utils/storage";
import Main from "./Main";
import Sidebar from "./Sidebar";
import "./styles/App.css";
import Topbar from "./Topbar";

const SplitContainer = styled.div`
    height: calc(100vh - 50px);
    padding-top: 50px;
`;

const App = () => {
    const [theme, setTheme] = React.useState(getItem("theme") || Classes.DARK);
    const [projects, setProjects] = React.useState([]);
    const [activeProject, setActiveProject] = React.useState({});

    React.useEffect(() => {
        async function getProjectsFromApi() {
            const savedProjects: any = await getProjects();
            setProjects(savedProjects);
        }
        getProjectsFromApi();
    }, [projects]);

    React.useEffect(() => {
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
