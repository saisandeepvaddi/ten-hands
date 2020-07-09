import React from "react";
import styled from "styled-components";
import { useProjects } from "../shared/stores/ProjectStore";

import ProjectsListContainer from "./ProjectsListContainer";

const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin-bottom: 15px;
  &:hover {
    overflow: auto;
  }
`;

const ProjectsList = React.memo(() => {
  const { projects } = useProjects();
  if (projects.length === 0) {
    return <div />;
  }

  return (
    <Container data-testid="project-list-container">
      <ProjectsListContainer />
    </Container>
  );
});

export default ProjectsList;
