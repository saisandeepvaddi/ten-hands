import React from "react";
import styled from "styled-components";
import { useTheme } from "../shared/stores/ThemeStore";
import { useProjects } from "../shared/stores/ProjectStore";
import { Classes, Button } from "@blueprintjs/core";
import { useConfig } from "../shared/stores/ConfigStore";

const Container = styled.div`
  height: 20px;
  background: ${props =>
    props.theme === Classes.DARK ? "#293742" : "#BFCCD6"};
  z-index: 9999;
  width: 100%;
  font-size: 0.75em;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Statusbar = () => {
  const { theme } = useTheme();
  const {
    totalRunningTaskCount,
    activeProject,
    projectsRunningTaskCount
  } = useProjects();

  const { changeConfigOption, config } = useConfig();
  const changeTerminalView = () => {
    if (config.taskViewStyle === "rows") {
      changeConfigOption("taskViewStyle", "tabs");
    } else {
      changeConfigOption("taskViewStyle", "rows");
    }
  };

  const activeProjectRunningTaskCount =
    projectsRunningTaskCount[activeProject._id!];

  return (
    <React.Fragment>
      <Container theme={theme}>
        <div className="left">
          Total running tasks: {totalRunningTaskCount}
          <Button
            small
            minimal
            onClick={() => changeTerminalView()}
            style={{ fontSize: "1em", marginLeft: 10 }}
          >
            Switch Terminal View
          </Button>
        </div>
        <div className="right">
          Tasks running in this project: {activeProjectRunningTaskCount ?? 0}
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Statusbar;
