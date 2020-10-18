import { Button, H5 } from "@blueprintjs/core";
import React, { useState } from "react";
import styled from "styled-components";
import { IProjectCommand } from "../../../types";
import { useConfig } from "../../stores/ConfigStore.ext";
import { useJobs } from "../../stores/JobStore.ext";
import { useRecoilValue } from "recoil";
import { activeProjectAtom } from "../../stores/projects.atom";
import { useSockets } from "../../stores/SocketStore.ext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const CommandTitleActions = styled.div`
  display: flex;
  width: 100%;
  /* max-width: 100%; */
  justify-content: space-between;
  align-items: center;
  & > h5 {
    font-size: 1em;
    margin: 0 0 4px;
  }
  & > * {
    margin-left: 1rem;
  }
`;

const CommandHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface ICommandProps {
  command: IProjectCommand;
}

function getJobData(state, taskID: string) {
  return state[taskID] || "";
}

const Command: React.FC<ICommandProps> = React.memo(({ command }) => {
  const {
    subscribeToTaskSocket,
    unsubscribeFromTaskSocket,
    restartTask,
  } = useSockets();
  const [] = React.useState<boolean>(false);
  const activeProject = useRecoilValue(activeProjectAtom);
  const taskID = command._id;
  const { state: jobState, dispatch, ACTION_TYPES } = useJobs();

  const { config } = useConfig();
  const [] = useState<number>(0);
  const [] = React.useState<boolean>(false);

  const updateJobProcess = (taskID, jobProcess) => {
    dispatch({
      taskID,
      type: ACTION_TYPES.UPDATE_JOB_PROCESS,
      process: jobProcess,
    });
  };

  const startJob = (taskID) => {
    const shell = command.shell || activeProject.shell || config.shell || "";
    subscribeToTaskSocket(taskID, command, activeProject.path, shell);
  };

  const stopJob = (taskID) => {
    const process = getJobData(jobState, taskID).process;
    const { pid } = process;
    unsubscribeFromTaskSocket(taskID, pid);
    updateJobProcess(taskID, {
      pid: -1,
    });
  };

  const restartJob = (taskID) => {
    const shell = command.shell || activeProject.shell || config.shell || "";
    const process = getJobData(jobState, taskID).process;
    const { pid } = process;
    restartTask(taskID, pid, command, activeProject.path, shell);
    updateJobProcess(taskID, {
      pid: -1,
    });
  };

  const isProcessRunning = (): boolean => {
    return getJobData(jobState, taskID).isRunning || false;
  };

  return (
    <React.Fragment>
      <Container>
        <CommandHeader>
          <CommandTitleActions>
            <H5 className="color-white" data-testid="command-name">
              {command.name}
            </H5>
            <div>
              {isProcessRunning() ? (
                <React.Fragment>
                  <Button
                    data-testid="stop-task-button"
                    intent="danger"
                    icon="stop"
                    minimal
                    disabled={!isProcessRunning()}
                    text={"Stop"}
                    onClick={() => stopJob(taskID)}
                  />
                  <Button
                    data-testid="restart-task-button"
                    intent="primary"
                    icon="refresh"
                    minimal
                    disabled={!isProcessRunning()}
                    text={"Restart"}
                    onClick={() => restartJob(taskID)}
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
                  onClick={() => startJob(taskID)}
                />
              )}
            </div>
          </CommandTitleActions>
          {/* <span
            data-testid="command-cmd"
            className="truncate"
            style={{ maxWidth: "50%" }}
            title={command.cmd}
          >
            {command.cmd}
          </span> */}
        </CommandHeader>
      </Container>
    </React.Fragment>
  );
});

export default Command;
