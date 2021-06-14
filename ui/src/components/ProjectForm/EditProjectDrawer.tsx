import { Drawer } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";

import { useTheme } from "../shared/stores/ThemeStore";
import EditProjectFormContainer from "./EditProjectFormContainer";

const DrawerContainer = styled.div`
  height: 100%;
  padding: 2.5em;
`;

interface IEditProjectDrawerProps {
  isDrawerOpen: boolean;
  setDrawerOpen: (isOpen: boolean) => any;
  activeProject: IProject;
}

const EditProjectDrawer: React.FC<IEditProjectDrawerProps> = React.memo(
  ({ isDrawerOpen, setDrawerOpen, activeProject }) => {
    const { theme } = useTheme();

    return (
      <Drawer
        className={theme}
        isOpen={isDrawerOpen}
        title="Add Project"
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerContainer>
          <EditProjectFormContainer
            activeProject={activeProject}
            setDrawerOpen={setDrawerOpen}
          />
        </DrawerContainer>
      </Drawer>
    );
  }
);

export default EditProjectDrawer;
