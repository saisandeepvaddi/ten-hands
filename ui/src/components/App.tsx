import React from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./styles/App.css";
import SplitPane from "react-split-pane";
import styled from "styled-components";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Main from "./Main";
import { getItem, setItem } from "../utils/storage";
import { ThemeContext } from "../utils/Context";

const SplitContainer = styled.div`
  height: calc(100vh - 50px);
  padding-top: 50px;
`;

const App = () => {
  const [theme, setTheme] = React.useState(getItem("theme") || "bp3-dark");

  React.useEffect(() => {
    setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      <div className={theme}>
        <Topbar theme={theme} setTheme={setTheme} />
        <SplitContainer>
          <SplitPane split="vertical" defaultSize={350} maxSize={500}>
            <Sidebar />
            <Main />
          </SplitPane>
        </SplitContainer>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
