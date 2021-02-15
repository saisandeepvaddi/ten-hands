import { Alert, Button, Collapse, H5, ResizeSensor } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import { useJobs, ACTION_TYPES } from "../shared/stores/JobStore";
import JobTerminalManager from "../shared/JobTerminalManager";
import { useProjects } from "../shared/stores/ProjectStore";
import { useSockets } from "../shared/stores/SocketStore";
import CommandOutputXterm from "./CommandOutputXterm";
import UpdateCommandDrawer from "../UpdateCommandDrawer";
import { useTheme } from "../shared/stores/ThemeStore";
import { useMotionValue } from "framer-motion";
import { useRecoilValue } from "recoil";
import { configAtom } from "../shared/state/atoms";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  /* overflow: auto;
  overflow-y: hidden; */
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

function getJobData(state, taskID: string) {
  return state[taskID] || "";
}

const Command: React.FC<ICommandProps> = React.memo(
  ({ command, projectPath, index, projectId }) => {
    const [isOutputOpen, setOutputOpen] = React.useState(true);
    const { theme } = useTheme();
    const {
      subscribeToTaskSocket,
      unsubscribeFromTaskSocket,
      restartTask,
    } = useSockets();
    const [isDrawerOpen, setDrawerOpen] = React.useState<boolean>(false);
    const taskID = command._id;
    const terminalManager = JobTerminalManager.getInstance();
    const { state: jobState, dispatch } = useJobs();
    const { activeProject, deleteTask, updateTask } = useProjects();
    const config = useRecoilValue(configAtom);
    const containerWidth = useMotionValue(0);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState<boolean>(
      false
    );
    const deleteCommand = async () => {
      try {
        await deleteTask(activeProject._id, taskID);
      } catch (error) {
        console.log("error:", error);
        console.error("Error deleting task");
      }
    };

    const updateJobProcess = (jobProcess) => {
      dispatch({
        taskID,
        type: ACTION_TYPES.UPDATE_JOB_PROCESS,
        process: jobProcess,
      });
    };

    const clearJobOutput = () => {
      dispatch({
        type: ACTION_TYPES.CLEAR_OUTPUT,
        taskID,
      });
      terminalManager.clearTerminalInRoom(taskID);
    };

    const startJob = () => {
      clearJobOutput();
      const shell = command.shell || activeProject.shell || config.shell || "";
      subscribeToTaskSocket(taskID, command, projectPath, shell);
      updateTask(projectId, command._id, {
        ...command,
        lastExecutedAt: new Date(),
      });
    };

    const stopJob = () => {
      const process = getJobData(jobState, taskID).process;
      const { pid } = process;
      unsubscribeFromTaskSocket(taskID, pid);
      updateJobProcess({
        pid: -1,
      });
    };

    const restartJob = () => {
      const shell = command.shell || activeProject.shell || config.shell || "";
      const process = getJobData(jobState, taskID).process;
      const { pid } = process;
      restartTask(taskID, pid, command, projectPath, shell);
      updateJobProcess({
        pid: -1,
      });
      clearJobOutput();
      updateTask(projectId, command._id, {
        ...command,
        lastExecutedAt: new Date(),
      });
    };

    const isProcessRunning = (): boolean => {
      return getJobData(jobState, taskID).isRunning || false;
    };

    // const handleSidebarResize = React.useCallback(
    //   throttle((width: number) => {
    //     setContainerWidth(width);
    //   }, 200),
    //   []
    // );

    return (
      <React.Fragment>
        <Container>
          <CommandHeader>
            <CommandTitleActions>
              <H5 data-testid="command-name">{command.name}</H5>
              {isProcessRunning() ? (
                <React.Fragment>
                  <Button
                    data-testid="stop-task-button"
                    intent="danger"
                    icon="stop"
                    minimal
                    disabled={!isProcessRunning()}
                    text={"Stop"}
                    onClick={() => stopJob()}
                  />
                  <Button
                    data-testid="restart-task-button"
                    intent="primary"
                    icon="refresh"
                    minimal
                    disabled={!isProcessRunning()}
                    text={"Restart"}
                    onClick={() => restartJob()}
                  />
                </React.Fragment>
              ) : (
                // </Popover>
                <Button
                  data-testid="start-task-button"
                  icon="play"
                  intent="success"
                  minimal
                  disabled={isProcessRunning()}
                  text={"Start"}
                  onClick={() => startJob()}
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
                onClick={() => clearJobOutput()}
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
                onClick={() => setIsDeleteAlertOpen(true)}
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
                // handleSidebarResize(width);
                containerWidth.set(width);
              }}
            >
              <CommandOutputXterm
                index={index}
                taskID={taskID}
                containerWidth={containerWidth}
              />
            </ResizeSensor>
          </Collapse>
        </Container>
        <UpdateCommandDrawer
          isDrawerOpen={isDrawerOpen}
          setDrawerOpen={setDrawerOpen}
          command={command}
        />
        <Alert
          cancelButtonText="Cancel"
          confirmButtonText="Yes, Delete"
          className={theme}
          icon="trash"
          intent="danger"
          isOpen={isDeleteAlertOpen}
          onCancel={() => setIsDeleteAlertOpen(false)}
          onConfirm={() => deleteCommand()}
        >
          <p data-testid="delete-task-warning">
            Are you sure you want to delete task <b>{command.name}</b>?
          </p>
        </Alert>
      </React.Fragment>
    );
  }
);

export default Command;
