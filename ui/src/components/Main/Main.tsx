import { Classes, Colors, Spinner } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import CommandsArea from "../CommandsArea";
import ProjectTopbar from "../ProjectTopbar";
import { useProjects } from "../shared/stores/ProjectStore";
import { useTheme } from "../shared/stores/ThemeStore";

const Container = styled.div`
  border-top: 1px solid transparent; /* To prevent margin-collapse for first child doesn't happen */
  background: ${props =>
    props.theme === Classes.DARK ? Colors.DARK_GRAY1 : Colors.LIGHT_GRAY1};
  height: 100%;
  max-width: 100%;
`;

const EmptyContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  & > span {
    padding: 10px;
    border-bottom: 1px solid #0a6640;
  }
`;

const Main = React.memo(() => {
  const { theme } = useTheme();
  const { activeProject, loadingProjects, projects } = useProjects();

  if (loadingProjects) {
    return (
      <EmptyContainer theme={theme} className="main-container">
        <Spinner />
      </EmptyContainer>
    );
  }
  if (!projects || projects.length === 0) {
    return (
      <EmptyContainer
        theme={theme}
        className="main-container"
        data-testid="no-projects-message"
      >
        Add a project using <span>New Project</span> button
      </EmptyContainer>
    );
  }
  return (
    <Container theme={theme} className="main-container">
      <ProjectTopbar activeProject={activeProject} />
      <CommandsArea activeProject={activeProject} />
    </Container>
  );
});

export default Main;
