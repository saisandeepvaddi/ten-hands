import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { activeProjectAtom } from "../../stores/projects.atom";
import Command from "../Command/Command";
import { Colors } from "@blueprintjs/core";

const ProjectNameContainer = styled.header`
  padding: 10px;
  background: ${Colors.DARK_GRAY2};
`;

const Main = () => {
  const activeProject = useRecoilValue(activeProjectAtom);
  if (!activeProject) {
    return null;
  }
  return (
    <div>
      <ProjectNameContainer>
        <h4 style={{ fontWeight: "bold" }}>{activeProject.name}</h4>
      </ProjectNameContainer>
      <div style={{ padding: 10 }}>
        {activeProject.commands.map((command) => (
          <Command key={command._id} command={command} />
        ))}
      </div>
    </div>
  );
};

export default Main;
