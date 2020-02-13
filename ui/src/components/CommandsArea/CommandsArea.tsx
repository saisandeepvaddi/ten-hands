import { Card, Elevation } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import Command from "../Command/Command";
import { useTheme } from "../shared/stores/ThemeStore";
import CommandsRowView from "./CommandsRowView";
import { useConfig } from "../shared/stores/ConfigStore";
import CommandsTabView from "./CommandsTabView";

interface ICommandsAreaProps {
  activeProject: IProject;
}

const Container = styled.div`
  height: calc(100% - 50px);
  overflow: auto;
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

const CommandsArea: React.SFC<ICommandsAreaProps> = React.memo(
  ({ activeProject }) => {
    const commands: IProjectCommand[] = activeProject.commands;
    const { config } = useConfig();
    const { theme } = useTheme();

    if (commands.length === 0) {
      return (
        <EmptyContainer
          theme={theme}
          className="main-container"
          data-testid="no-tasks-message"
        >
          Add a task using <span>New Task</span> button
        </EmptyContainer>
      );
    }
    return (
      <Container>
        {config.taskViewStyle === "rows" ? (
          <CommandsRowView commands={commands} activeProject={activeProject} />
        ) : (
          <CommandsTabView commands={commands} activeProject={activeProject} />
        )}
      </Container>
    );
  }
);

export default CommandsArea;
