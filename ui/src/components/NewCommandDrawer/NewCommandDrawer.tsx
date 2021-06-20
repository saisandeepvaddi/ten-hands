import { Drawer } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";

import { useTheme } from "../shared/stores/ThemeStore";
import NewCommandFormContainer from "./NewCommandFormContainer";

const DrawerContainer = styled.div`
  height: 100%;
  padding: 2.5em;
`;

interface INewDrawerProps {
  isDrawerOpen: boolean;
  setDrawerOpen: (isOpen: boolean) => any;
}

const NewCommandDrawer: React.FC<INewDrawerProps> = React.memo(
  ({ isDrawerOpen, setDrawerOpen }) => {
    const { theme } = useTheme();

    return (
      <Drawer
        className={theme}
        isOpen={isDrawerOpen}
        title="Add Task"
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerContainer>
          <NewCommandFormContainer setDrawerOpen={setDrawerOpen} />
        </DrawerContainer>
      </Drawer>
    );
  },
);

export default NewCommandDrawer;
