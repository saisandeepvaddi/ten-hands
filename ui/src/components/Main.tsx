import { Button, Classes, Colors } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import { ThemeContext } from "../utils/Context";
import CommandsArea from "./CommandsArea";
import ProjectTopbar from "./ProjectTopbar";

const Container = styled.div`
    position: relative;
    border-top: 1px solid transparent; /* To prevent margin-collapse for first child doesn't happen */
    background: ${props => (props.theme === Classes.DARK ? Colors.DARK_GRAY1 : Colors.LIGHT_GRAY1)};
    height: 100%;
    /* overflow-y: auto; */
`;

const Footer = styled.div`
    width: 100%;
    position: absolute;
    bottom: 0;
    display: flex;
    padding: 1rem;
    align-items: center;
    & > button {
        margin-left: auto;
    }
`;

interface IMainProps {
    activeProject: IProject;
}

const Main: React.FC<IMainProps> = ({ activeProject }) => {
    const theme = React.useContext(ThemeContext);
    const commandsInProject: IProjectCommand[] = activeProject.commands;
    return (
        <Container theme={theme} className="main-container">
            <ProjectTopbar activeProject={activeProject} />
            <CommandsArea commands={commandsInProject} splitDirection={`horizontal`} />
            <Footer>{/*  */}</Footer>
        </Container>
    );
};

Main.defaultProps = {
    activeProject: {
        id: "",
        name: "",
        type: "",
        commands: [],
    },
};

export default Main;
