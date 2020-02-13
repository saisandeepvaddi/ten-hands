import React from "react";
import { Menu, MenuDivider, MenuItem } from "@blueprintjs/core";

interface IProjectMenuProps {
  setRenameProjectModalOpen: (value: React.SetStateAction<boolean>) => void;
  setCommandsOrderModalOpen: (value: React.SetStateAction<boolean>) => void;
  setDeleteAlertOpen: (value: React.SetStateAction<boolean>) => void;
  activeProject: IProject;
  projectsRunningTaskCount: {
    [key: string]: number;
  };
}

const ProjectMenu: React.FC<IProjectMenuProps> = ({
  setRenameProjectModalOpen,
  setCommandsOrderModalOpen,
  setDeleteAlertOpen,
  activeProject,
  projectsRunningTaskCount
}) => {
  return (
    <React.Fragment>
      <Menu key="menu">
        <MenuDivider title="Edit" />
        <MenuItem
          data-testid="rename-project-menu-item"
          icon="edit"
          text="Rename Project"
          onClick={() => setRenameProjectModalOpen(true)}
        />
        <MenuDivider title="Layout" />
        <MenuItem
          data-testid="change-tasks-order-menu-item"
          icon="sort"
          text="Change Tasks Order"
          onClick={() => setCommandsOrderModalOpen(true)}
        />
        <MenuDivider title="Danger" />
        <MenuItem
          data-testid="delete-project-menu-item"
          icon="trash"
          text="Delete Project"
          intent="danger"
          onClick={() => setDeleteAlertOpen(true)}
          title={
            projectsRunningTaskCount[activeProject._id!] > 0
              ? "Cannot delete project while tasks are running."
              : undefined
          }
          disabled={projectsRunningTaskCount[activeProject._id!] > 0}
        />
      </Menu>
    </React.Fragment>
  );
};

export default ProjectMenu;
