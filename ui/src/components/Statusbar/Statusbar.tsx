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
  return (
    <React.Fragment>
      <Container theme={theme}>
        <div className="total-stats">
          Total Running tasks: {totalRunningTaskCount}
        </div>
        <div className="active-project-stats">
          {projectsRunningTaskCount[activeProject._id!] ?? 0} tasks running
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Statusbar;
