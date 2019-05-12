import { Classes, Colors } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import CommandsArea from "../CommandsArea";
import ProjectTopbar from "../ProjectTopbar";
import { useProjects } from "../shared/Projects";
import { useTheme } from "../shared/Themes";

const Container = styled.div`
    position: relative;
    border-top: 1px solid transparent; /* To prevent margin-collapse for first child doesn't happen */
    background: ${props => (props.theme === Classes.DARK ? Colors.DARK_GRAY1 : Colors.LIGHT_GRAY1)};
    height: 100%;
`;

const Main = React.memo(() => {
    const { theme } = useTheme();
    const { activeProject } = useProjects();
    const commandsInProject: IProjectCommand[] = activeProject.commands;
    return (
        <Container theme={theme} className="main-container">
            <ProjectTopbar activeProject={activeProject} />
            <CommandsArea commands={commandsInProject} />
        </Container>
    );
});

export default Main;
