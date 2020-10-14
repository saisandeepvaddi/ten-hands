import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { activeProjectIDAtom, projectsAtom } from "../../stores/projects.atom";
import styled from "styled-components";

export const Item = styled.div`
  width: 100%;
  padding: 10px;
  &:hover {
    cursor: pointer;
    color: #48aff0 !important;
  }
`;

const Sidebar = () => {
  const projects = useRecoilValue(projectsAtom);
  const updateActiveProject = useSetRecoilState(activeProjectIDAtom);

  return (
    <React.Fragment>
      {projects.map((project) => (
        <Item
          key={project._id}
          onClick={() => {
            updateActiveProject(project._id);
          }}
          className="truncate"
          title={project.name}
        >
          {project.name}
        </Item>
      ))}
    </React.Fragment>
  );
};

export default Sidebar;
