import { Button } from "@blueprintjs/core";
import React from "react";

import NewProjectDrawer from "../NewProjectDrawer";
import ProjectsList from "../ProjectsList";
import { useProjects } from "../shared/Projects";
import DragDropContainer from "./DragDropContainer";

const Sidebar = React.memo(() => {
    const [isDrawerOpen, setDrawerOpen] = React.useState(false);
    const { projects } = useProjects();

    return (
        <DragDropContainer>
            <Button
                data-testid="new-project-button"
                icon="add"
                intent="success"
                text="New Project"
                className="truncate"
                large={true}
                style={{ width: "100%" }}
                onClick={() => setDrawerOpen(true)}
            />
            {projects.length > 0 && <ProjectsList />}

            <NewProjectDrawer isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
        </DragDropContainer>
    );
});

export default Sidebar;
