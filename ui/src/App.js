import React from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { Colors } from "@blueprintjs/core";
import "./App.css";
import SplitPane from "react-split-pane";

import styled, { ThemeProvider } from "styled-components";

const THEME = {
  light: {
    lightBackground1: Colors.LIGHT_GRAY1,
    lightBackground2: Colors.LIGHT_GRAY2,
    lightBackground3: Colors.LIGHT_GRAY3
  },
  dark: {
    darkBackground1: Colors.DARK_GRAY1,
    darkBackground2: Colors.DARK_GRAY2,
    darkBackground3: Colors.DARK_GRAY3
  }
};

const TopBar = styled.div`
  height: 50px;
  background-color: ${props => props.theme.dark.darkBackground2};
`;

const SplitContainer = styled.div`
  height: calc(100vh - 50px);
`;

const Sidebar = styled.div`
  background: ${Colors.DARK_GRAY3};
  height: 100%;
`;

const Main = styled.div`
  background: ${Colors.DARK_GRAY2};
  height: 100%;
`;

const App = () => {
  return (
    <ThemeProvider theme={THEME}>
      <>
        <TopBar />
        <SplitContainer>
          <SplitPane split="vertical" defaultSize={200} maxSize={500}>
            <Sidebar />
            <Main />
          </SplitPane>
        </SplitContainer>
      </>
    </ThemeProvider>
  );
};

export default App;
