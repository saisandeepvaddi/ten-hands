import React from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./App.css";
import SplitPane from "react-split-pane";
import styled, { ThemeProvider } from "styled-components";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";

const SplitContainer = styled.div`
  height: calc(100vh - 50px);
`;

const App = () => {
  return (
    <ThemeProvider theme={{}}>
      <>
        <Topbar />
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
