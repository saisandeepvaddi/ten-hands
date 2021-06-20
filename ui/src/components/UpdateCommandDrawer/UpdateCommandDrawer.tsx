import { Drawer } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";

import { useTheme } from "../shared/stores/ThemeStore";
import UpdateCommandForm from "./UpdateCommandFormContainer";

const DrawerContainer = styled.div`
  height: 100%;
  padding: 2.5em;
`;

interface INewDrawerProps {
  isDrawerOpen: boolean;
  setDrawerOpen: (isOpen: boolean) => any;
  command: IProjectCommand;
}

const UpdateCommandDrawer: React.FC<INewDrawerProps> = React.memo(
  ({ isDrawerOpen, setDrawerOpen, command }) => {
    const { theme } = useTheme();

    return (
      <Drawer
        className={theme}
        isOpen={isDrawerOpen}
        title="Add Task"
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerContainer>
          <UpdateCommandForm command={command} setDrawerOpen={setDrawerOpen} />
        </DrawerContainer>
      </Drawer>
    );
  },
);

export default UpdateCommandDrawer;
