import React from "react";
import styled from "styled-components";
import { useProjects } from "../shared/stores/ProjectStore";

import ProjectsListContainer from "./ProjectsListContainer";

const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
  margin-bottom: 15px;
`;

const ProjectsList = React.memo(() => {
  const { projects } = useProjects();

  if (projects.length === 0) {
    return <div />;
  }

  return (
    <Container>
      <ProjectsListContainer />
    </Container>
  );
});

export default ProjectsList;
