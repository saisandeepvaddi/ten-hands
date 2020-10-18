import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
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
  const [activeProjectId, updateActiveProjectID] = useRecoilState(
    activeProjectIDAtom
  );

  return (
    <div>
      {projects.map((project, i) => {
        const isActiveProject =
          (activeProjectId === null && i === 0) ||
          project._id === activeProjectId;
        return (
          <Item
            key={project._id}
            onClick={() => {
              updateActiveProjectID(project._id);
            }}
            className="truncate"
            title={project.name}
            style={{
              color: isActiveProject ? "#48aff0" : "inherit",
              background: isActiveProject
                ? "rgba(19, 124, 189, 0.2)"
                : "inherit",
            }}
          >
            {project.name}
          </Item>
        );
      })}
    </div>
  );
};

export default Sidebar;
