import { Classes, Colors } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import { ThemeContext } from "../../utils/Context";
import CommandsArea from "../CommandsArea";
import ProjectTopbar from "../ProjectTopbar";

const Container = styled.div`
    position: relative;
    border-top: 1px solid transparent; /* To prevent margin-collapse for first child doesn't happen */
    background: ${props => (props.theme === Classes.DARK ? Colors.DARK_GRAY1 : Colors.LIGHT_GRAY1)};
    height: 100%;
`;

interface IMainProps {
    activeProject: IProject;
}

const Main: React.FC<IMainProps> = React.memo(({ activeProject }) => {
    const theme = React.useContext(ThemeContext);
    const commandsInProject: IProjectCommand[] = activeProject.commands;
    return (
        <Container theme={theme} className="main-container">
            <ProjectTopbar activeProject={activeProject} />
            <CommandsArea commands={commandsInProject} splitDirection={`horizontal`} />
        </Container>
    );
});

Main.defaultProps = {
    activeProject: {
        _id: "",
        name: "",
        type: "",
        commands: [],
    },
};

export default Main;
