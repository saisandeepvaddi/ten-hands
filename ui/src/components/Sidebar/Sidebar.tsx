import { Button, Classes, Colors } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";

import NewProjectDrawer from "../NewProjectDrawer";
import ProjectsList from "../ProjectsList";
import { useProjects } from "../shared/Projects";
import { useTheme } from "../shared/Themes";

const Container = styled.div`
    background: ${props => (props.theme === Classes.DARK ? Colors.DARK_GRAY2 : Colors.LIGHT_GRAY2)};
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
`;

const Sidebar = React.memo(() => {
    const { theme } = useTheme();
    const [isDrawerOpen, setDrawerOpen] = React.useState(false);
    const { projects } = useProjects();

    return (
        <Container theme={theme}>
            <Button
                data-testid="new-project-button"
                icon="add"
                intent="success"
                text="New Project"
                large={true}
                style={{ width: "100%" }}
                onClick={() => setDrawerOpen(true)}
            />
            {projects.length > 0 && <ProjectsList />}
            <NewProjectDrawer isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
        </Container>
    );
});

export default Sidebar;
