import React from "react";
import styled from "styled-components";
import { useTheme } from "../shared/stores/ThemeStore";
import { useProjects } from "../shared/stores/ProjectStore";
import { Classes } from "@blueprintjs/core";

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
  const activeProjectRunningTaskCount =
    projectsRunningTaskCount[activeProject._id!];
  return (
    <React.Fragment>
      <Container theme={theme}>
        <div className="total-stats">
          Total running tasks: {totalRunningTaskCount}
        </div>
        <div className="active-project-stats">
          Tasks running in this project: {activeProjectRunningTaskCount ?? 0}
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Statusbar;
