import React, { useRef } from "react";
import { useJobs } from "../shared/stores/JobStore";
import { useProjects } from "../shared/stores/ProjectStore";
import styled from "styled-components";
import { wait } from "../shared/utilities";
import { Button, Alignment, Icon } from "@blueprintjs/core";
import { useSockets } from "../shared/stores/SocketStore";
import JobTerminalManager from "../shared/JobTerminalManager";
import { useConfig } from "../shared/stores/ConfigStore";
import { useRecoilValue } from "recoil";
import { siderWidthAtom } from "../shared/state/layout";

const TaskContainer = styled.div`
  display: flex;
  align-items: center;
  .task-action-button-container {
    visibility: hidden;
  }
  &:hover {
    .task-action-button-container {
      visibility: visible;
    }
  }
`;

interface IProjectTaskItemProps {
  command: IProjectCommand;
  project: IProject;
  changeActiveProject: () => any;
}

function getJobData(state, room: string) {
  return state[room] || "";
}

const ProjectTaskItem: React.FC<IProjectTaskItemProps> = ({
  command,
  project,
  changeActiveProject,
}) => {
  const room = command._id;
  const projectPath = project.path;
  const projectId = project._id;
  const terminalManager = JobTerminalManager.getInstance();
  const actionButtonContainerRef = useRef<HTMLSpanElement>(null);

  const { runningTasks, state: jobState, dispatch, ACTION_TYPES } = useJobs();
  const { activeProject, updateTask } = useProjects();
  const {
    subscribeToTaskSocket,
    unsubscribeFromTaskSocket,
    restartTask,
  } = useSockets();
  const { config } = useConfig();
  const siderWidth = useRecoilValue(siderWidthAtom);

  const isThisActiveProject = activeProject._id === project._id;

  const isTaskRunning = (taskId: string) => {
    return runningTasks[taskId] === true;
  };

  const scrollToTask = async task => {
    // If you click on task directly it should first switch the active project then scroll to task
    if (!isThisActiveProject) {
      changeActiveProject();
      await wait(200);
    }

    const taskCard = document.getElementById(`task-card-${task._id}`);
    if (taskCard) {
      taskCard.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const clearJobOutput = room => {
    dispatch({
      type: ACTION_TYPES.CLEAR_OUTPUT,
      room,
    });
    terminalManager.clearTerminalInRoom(room);
  };

  const updateJobProcess = (room, jobProcess) => {
    dispatch({
      room,
      type: ACTION_TYPES.UPDATE_JOB_PROCESS,
      process: jobProcess,
    });
  };

  const startJob = () => {
    clearJobOutput(room);
    const shell = command.shell || activeProject.shell || config.shell || "";
    subscribeToTaskSocket(room, command, projectPath, shell);
    updateTask(project._id, command._id, {
      ...command,
      lastExecutedAt: new Date(),
    });
  };

  const stopJob = () => {
    const process = getJobData(jobState, room).process;
    const { pid } = process;
    unsubscribeFromTaskSocket(room, pid);
    updateJobProcess(room, {
      pid: -1,
    });
  };

  const restartJob = room => {
    const shell = command.shell || activeProject.shell || config.shell || "";
    const process = getJobData(jobState, room).process;
    const { pid } = process;
    restartTask(room, pid, command, projectPath, shell);
    updateJobProcess(room, {
      pid: -1,
    });
    clearJobOutput(room);
    updateTask(projectId, command._id, {
      ...command,
      lastExecutedAt: new Date(),
    });
  };

  const startTask = e => {
    try {
      startJob();
    } catch (error) {
      console.log(`startTask error: `, error);
    }
  };

  const stopTask = e => {
    try {
      stopJob();
    } catch (error) {
      console.log(`stopTask error: `, error);
    }
  };

  const restart = e => {
    try {
      restartJob(room);
    } catch (error) {
      console.log(`restart error: `, error);
    }
  };

  return (
    <React.Fragment>
      <Button
        key={command._id}
        data-testid="project-task-button"
        fill
        title={command.cmd}
        style={{
          padding: 5,
        }}
        minimal
        onClick={() => scrollToTask(command)}
        alignText={Alignment.LEFT}
        icon={
          <Icon
            icon={"dot"}
            color={isTaskRunning(command._id) ? "green" : undefined}
          />
        }
        className="truncate"
      >
        <TaskContainer>
          {command.name}
          <span
            style={{
              marginLeft: "auto",
            }}
            className="task-action-button-container"
            ref={actionButtonContainerRef}
            /*eslint-disable*/
          >
            {isTaskRunning(command._id) ? (
              // Using anchor tag instead of Button to avoid blueprintjs warning about nested buttons

              <React.Fragment>
                <a
                  type="button"
                  className="bp3-button bp3-minimal bp3-intent-primary bp3-icon-refresh"
                  title={`Restart '${command.name}' task`}
                  onClick={restart}
                  style={{
                    marginRight: siderWidth < 400 ? "15px" : "",
                  }}
                >
                  {siderWidth > 400 ? "Restart" : null}
                </a>
                <a
                  type="button"
                  className="bp3-button bp3-minimal bp3-intent-danger bp3-icon-stop"
                  title={`Stop '${command.name}' task`}
                  onClick={stopTask}
                >
                  {siderWidth > 400 ? "Stop" : null}
                </a>
              </React.Fragment>
            ) : (
              <a
                type="button"
                className="bp3-button bp3-minimal bp3-intent-success bp3-icon-play"
                title={`Start '${command.name}' task`}
                onClick={startTask}
              >
                {siderWidth > 400 ? "Start" : null}
              </a>
              /*eslint-enable*/
            )}
          </span>
        </TaskContainer>
      </Button>
    </React.Fragment>
  );
};

export default ProjectTaskItem;
