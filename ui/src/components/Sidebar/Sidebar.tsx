import { Button } from "@blueprintjs/core";
import React from "react";

import NewProjectDrawer from "../NewProjectDrawer";
import ProjectsListContainer from "../ProjectsList/ProjectsListContainer";
import { useProjects } from "../shared/stores/ProjectStore";
import DragDropContainer from "./DragDropContainer";

const Sidebar = () => {
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
        style={{ margin: "0 10px" }}
        onClick={() => setDrawerOpen(true)}
      />
      {projects.length > 0 && <ProjectsListContainer />}

      <NewProjectDrawer
        isDrawerOpen={isDrawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
    </DragDropContainer>
  );
};

export default Sidebar;
