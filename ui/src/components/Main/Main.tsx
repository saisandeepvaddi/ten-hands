import { Classes, Colors } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import CommandsArea from "../CommandsArea";
import ProjectTopbar from "../ProjectTopbar";
import { useProjects } from "../shared/Projects";
import { useTheme } from "../shared/Themes";

const Container = styled.div`
    border-top: 1px solid transparent; /* To prevent margin-collapse for first child doesn't happen */
    background: ${props => (props.theme === Classes.DARK ? Colors.DARK_GRAY1 : Colors.LIGHT_GRAY1)};
    height: 100%;
    max-width: 100%;
`;

const EmptyContainer = styled(Container)`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
`;

const Main = React.memo(() => {
    const { theme } = useTheme();
    const { activeProject } = useProjects();
    console.log("activeProject:", activeProject);
    if (activeProject._id === "") {
        return (
            <EmptyContainer theme={theme} className="main-container">
                Add a project using New Project button
            </EmptyContainer>
        );
    }
    return (
        <Container theme={theme} className="main-container">
            <ProjectTopbar activeProject={activeProject} />
            <CommandsArea activeProject={activeProject} />
        </Container>
    );
});

export default Main;
