import { Button, Classes, Colors } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import { ProjectsContext, ThemeContext } from "../utils/Context";

import { JsonArray } from "type-fest";
import { getProjects } from "../utils/api";
import ProjectsList from "./ProjectsList";

const Container = styled.div`
    background: ${props => (props.theme === Classes.DARK ? Colors.DARK_GRAY2 : Colors.LIGHT_GRAY2)};
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
`;

interface ISidebarProps {
    setActiveProject?: any;
}

const Sidebar: React.FC<ISidebarProps> = ({ setActiveProject }) => {
    const theme = React.useContext(ThemeContext);
    const projects = React.useContext(ProjectsContext);

    return (
        <Container theme={theme}>
            <Button icon="add" intent="success" text="New Project" large={true} style={{ width: "100%" }} />
            <ProjectsList projects={projects} setActiveProject={setActiveProject} />
        </Container>
    );
};

export default Sidebar;
