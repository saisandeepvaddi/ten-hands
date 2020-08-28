import { Button, Collapse, H5, ResizeSensor } from "@blueprintjs/core";
import React, { useState } from "react";
import styled from "styled-components";
import { useJobs } from "../shared/stores/JobStore";
import JobTerminalManager from "../shared/JobTerminalManager";
import { useProjects } from "../shared/stores/ProjectStore";
import { useSockets } from "../shared/stores/SocketStore";
import CommandOutputXterm from "./CommandOutputXterm";
import UpdateCommandDrawer from "../UpdateCommandDrawer";
import { useConfig } from "../shared/stores/ConfigStore";
import { throttle } from "lodash";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const CommandTitleActions = styled.div`
  display: flex;
  max-width: 100%;
  justify-content: space-between;
  align-items: center;
  & > h5 {
    margin: 0 0 4px;
  }
  & > * {
    margin-left: 1rem;
  }
`;

const CommandOutputButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 15%;
`;

const CommandHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface ICommandProps {
  command: IProjectCommand;
  projectPath: string;
  projectId: string;
  index: number;
}

function getJobData(state, room: string) {
  return state[room] || "";
}

const Command: React.FC<ICommandProps> = React.memo(
  ({ command, projectPath, index, projectId }) => {
    const [isOutputOpen, setOutputOpen] = React.useState(true);
    const { subscribeToTaskSocket, unsubscribeFromTaskSocket } = useSockets();
    const [isDrawerOpen, setDrawerOpen] = React.useState<boolean>(false);

    const room = command._id;
    const terminalManager = JobTerminalManager.getInstance();
    const { state: jobState, dispatch, ACTION_TYPES } = useJobs();
    const { activeProject, deleteTask, updateTask } = useProjects();
    const { config } = useConfig();
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const deleteCommand = async () => {
      try {
        await deleteTask(activeProject._id!, room);
      } catch (error) {
        console.log("error:", error);
        console.error("Error deleting task");
      }
    };

    const updateJobProcess = (room, jobProcess) => {
      dispatch({
        room,
        type: ACTION_TYPES.UPDATE_JOB_PROCESS,
        process: jobProcess,
      });
    };

    const clearJobOutput = (room) => {
      dispatch({
        type: ACTION_TYPES.CLEAR_OUTPUT,
        room,
      });
      terminalManager.clearTerminalInRoom(room);
    };

    const startJob = (room) => {
      clearJobOutput(room);
      const shell = command.shell || activeProject.shell || config.shell || "";
      subscribeToTaskSocket(room, command, projectPath, shell);
      updateTask(projectId, command._id, {
        ...command,
        lastExecutedAt: new Date(),
      });
    };

    const stopJob = (room) => {
      const process = getJobData(jobState, room).process;
      const { pid } = process;
      unsubscribeFromTaskSocket(room, pid);
      updateJobProcess(room, {
        pid: -1,
      });
    };

    const isProcessRunning = (): boolean => {
      return getJobData(jobState, room).isRunning || false;
    };

    const handleSidebarResize = React.useCallback(
      throttle((width: number) => {
        setContainerWidth(width);
      }, 200),
      []
    );

    return (
      <React.Fragment>
        <Container>
          <CommandHeader>
            <CommandTitleActions>
              <H5 data-testid="command-name">{command.name}</H5>
              {isProcessRunning() ? (
                <Button
                  data-testid="stop-task-button"
                  intent="danger"
                  icon="stop"
                  minimal
                  disabled={!isProcessRunning()}
                  text="Stop"
                  onClick={() => stopJob(room)}
                />
              ) : (
                <Button
                  data-testid="start-task-button"
                  icon="play"
                  intent="success"
                  minimal
                  disabled={isProcessRunning()}
                  text="Start"
                  onClick={() => startJob(room)}
                />
              )}
            </CommandTitleActions>
            <span
              data-testid="command-cmd"
              className="truncate"
              style={{ maxWidth: "50%" }}
              title={command.cmd}
            >
              {command.cmd}
            </span>
            <CommandOutputButtonsContainer>
              <Button
                onClick={() => setDrawerOpen(true)}
                icon="edit"
                minimal={true}
                title="Edit Task"
              />
              <Button
                onClick={() => clearJobOutput(room)}
                icon="eraser"
                minimal={true}
                title="Clear Output"
              />
              <Button
                onClick={() => setOutputOpen(!isOutputOpen)}
                icon={isOutputOpen ? "eye-off" : "eye-open"}
                minimal={true}
                title={isOutputOpen ? "Hide Output" : "Show Output"}
              />
              <Button
                onClick={deleteCommand}
                icon="trash"
                minimal={true}
                data-testid="delete-task-button"
                title={
                  isProcessRunning()
                    ? "Cannot delete while task is running."
                    : "Delete Task"
                }
                intent="danger"
                disabled={isProcessRunning()}
              />
            </CommandOutputButtonsContainer>
          </CommandHeader>
          <Collapse isOpen={isOutputOpen} keepChildrenMounted={true}>
            <ResizeSensor
              onResize={(entries) => {
                const width: number = entries[0].contentRect.width;
                // setContainerWidth(width);
                handleSidebarResize(width);
              }}
            >
              <div
                className="my-terminal-container"
                style={{
                  width: "100%",
                  height: "100%",
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <CommandOutputXterm
                  index={index}
                  room={room}
                  containerWidth={containerWidth}
                />
              </div>
            </ResizeSensor>
          </Collapse>
        </Container>
        <UpdateCommandDrawer
          isDrawerOpen={isDrawerOpen}
          setDrawerOpen={setDrawerOpen}
          command={command}
        />
      </React.Fragment>
    );
  }
);

export default Command;
