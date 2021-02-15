import React from "react";
import {
  deleteProjectInDb,
  deleteTaskInDb,
  getProjects,
  renameProjectInDb,
  reorderTasksInDb,
  saveProjectInDb,
  saveTaskInDb,
  updateTaskInDb,
  updateProjectInDb,
  updateRunningTaskCountInDB,
} from "../API";
import { useMountedState } from "../hooks";
import { useJobs, ACTION_TYPES } from "./JobStore";
import JobTerminalManager from "../JobTerminalManager";
import { useSockets } from "./SocketStore";
import { isRunningInElectron } from "../../../utils/electron";
import { useRecoilState, useRecoilValue } from "recoil";
import { activeProjectAtom, projectsAtom, configAtom } from "../state/atoms";

interface IProjectContextValue {
  projectsRunningTaskCount: { [key: string]: number };
  totalRunningTaskCount: number;
  projects: IProject[];
  activeProject: IProject;
  setActiveProject: (activeProject: IProject) => void;
  setProjects: any;
  updateProjects: () => void;
  addTask: (projectId: string, task: IProjectCommand) => any;
  updateTask: (projectId: string, taskId: string, task: IProjectCommand) => any;
  deleteTask: (projectId: string, taskId: string) => any;
  addProject: (data: any) => any;
  deleteProject: (projectId: string) => any;
  reorderTasks: (
    projectId: string,
    newTasks: IProjectCommand[],
    taskSortOrder?: TASK_SORT_ORDER
  ) => any;
  loadingProjects: boolean;
  renameProject: (projectId: string, newName: string) => any;
  updateProject: (projectId: string, newProjectData: IProject) => any;
  runAllStoppedTasks: () => void;
  stopAllRunningTasks: () => void;
}

interface IProjectsProviderProps {
  value?: IProjectContextValue;
  children: React.ReactNode;
}

function getJobData(state, taskID: string) {
  return state[taskID] || "";
}

const getRunningTasksCountForProjects = (
  projects: IProject[],
  runningTasks: any
): {
  runningTasksPerProject: Record<string, number>;
  totalRunningTaskCount: number;
} => {
  const runningTasksPerProject = {};
  let totalRunningTaskCount = 0;
  projects.forEach((project: IProject) => {
    const { commands, _id: projectID } = project;
    let runningCount = 0;
    commands.forEach((command: IProjectCommand) => {
      const { _id: commandID } = command;
      if (runningTasks[commandID]) {
        runningCount++;
        totalRunningTaskCount++;
      }
    });
    runningTasksPerProject[projectID] = runningCount;
  });

  return { runningTasksPerProject, totalRunningTaskCount };
};

export const ProjectContext = React.createContext<
  IProjectContextValue | undefined
>(undefined);

function ProjectsProvider(props: IProjectsProviderProps) {
  const initialProject = React.useMemo<IProject>(
    () => ({
      _id: "",
      name: "",
      type: "",
      path: "",
      shell: "",
      commands: [],
    }),
    []
  );

  const isMounted = useMountedState();
  const { runningTasks, state: jobState, dispatch, isTaskRunning } = useJobs();
  const terminalManager = JobTerminalManager.getInstance();
  const { subscribeToTaskSocket, unsubscribeFromTaskSocket } = useSockets();

  // const { config } = useConfig();
  const config = useRecoilValue(configAtom);
  const [activeProject, setActiveProject] = useRecoilState(activeProjectAtom);
  const [projects, setProjects] = useRecoilState(projectsAtom);
  const [loadingProjects, setLoadingProjects] = React.useState(true);
  const [
    projectsRunningTaskCount,
    setProjectsRunningTaskCount,
  ] = React.useState<any>({});

  const clearJobOutput = React.useCallback(
    (taskID) => {
      dispatch({
        type: ACTION_TYPES.CLEAR_OUTPUT,
        taskID,
      });
      terminalManager.clearTerminalInRoom(taskID);
    },
    [dispatch, terminalManager]
  );

  const updateJobProcess = React.useCallback(
    (taskID, jobProcess) => {
      dispatch({
        taskID,
        type: ACTION_TYPES.UPDATE_JOB_PROCESS,
        process: jobProcess,
      });
    },
    [dispatch]
  );

  const stopJob = React.useCallback(
    (command: IProjectCommand) => {
      const taskID = command._id;
      const process = getJobData(jobState, taskID).process;
      const { pid } = process;
      unsubscribeFromTaskSocket(taskID, pid);
      updateJobProcess(taskID, {
        pid: -1,
      });
    },
    [jobState, updateJobProcess, unsubscribeFromTaskSocket]
  );

  const stopTask = React.useCallback(
    (command: IProjectCommand) => {
      try {
        stopJob(command);
      } catch (error) {
        console.log(`stopTask error: `, error);
      }
    },
    [stopJob]
  );
  const [
    totalRunningTaskCount,
    setTotalRunningTaskCount,
  ] = React.useState<number>(0);

  const updateProjects = React.useCallback(() => {
    const reloadProjects = async () => {
      try {
        setLoadingProjects(true);
        const receivedProjects: IProject[] = await getProjects(config);
        if (receivedProjects?.length > 0) {
          setProjects(receivedProjects);
          if (activeProject._id === "") {
            setActiveProject(receivedProjects[0]);
          } else {
            // Commands order might be changed.
            const newActiveProject = receivedProjects.find(
              (project) => project._id === activeProject._id
            );

            // If the project was deleted
            if (newActiveProject) {
              setActiveProject(newActiveProject);
            } else {
              setActiveProject(receivedProjects[0]);
            }
          }
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted()) {
          setLoadingProjects(false);
        }
      }
    };
    reloadProjects();
  }, [config, setProjects, activeProject._id, setActiveProject, isMounted]);

  const deleteTask = React.useCallback(
    (projectId, taskId) => {
      const deleteTaskFn = async () => {
        await deleteTaskInDb(config, projectId, taskId);
        const currentProjectIndex = projects.findIndex(
          (x) => x._id === projectId
        );
        const projectWithThisTask = projects[currentProjectIndex];

        if (projectWithThisTask) {
          const currentTasks = [...projectWithThisTask.commands];
          const updatedTasks = currentTasks.filter(
            (x: IProjectCommand) => x._id !== taskId
          );
          const updatedProject: IProject = {
            ...projectWithThisTask,
            commands: updatedTasks,
          };
          const _projects = [...projects];
          _projects.splice(currentProjectIndex, 1, updatedProject);
          setProjects(_projects);
          setActiveProject(updatedProject);
        }
      };
      deleteTaskFn();
    },
    [config, projects, setProjects, setActiveProject]
  );

  const renameProject = React.useCallback(
    (projectId: string, newName: string) => {
      const renameProjectFn = async () => {
        await renameProjectInDb(config, projectId, newName);
        const currentProjectIndex = projects.findIndex(
          (x) => x._id === projectId
        );
        const renamingProject = projects[currentProjectIndex];

        if (renamingProject) {
          const updatedProject: IProject = {
            ...renamingProject,
            name: newName,
          };
          const _projects = [...projects];
          _projects.splice(currentProjectIndex, 1, updatedProject);
          if (isMounted()) {
            setProjects(_projects);
            setActiveProject(updatedProject);
          }
        }
      };

      renameProjectFn();
    },
    [config, projects, isMounted, setProjects, setActiveProject]
  );

  const updateProject = React.useCallback(
    (projectId: string, newProjectData: IProject) => {
      const updateProjectFn = async () => {
        await updateProjectInDb(config, projectId, newProjectData);
        const currentProjectIndex = projects.findIndex(
          (x) => x._id === projectId
        );
        const renamingProject = projects[currentProjectIndex];

        if (renamingProject) {
          const updatedProject: IProject = {
            ...renamingProject,
            ...newProjectData,
          };
          const _projects = [...projects];
          _projects.splice(currentProjectIndex, 1, updatedProject);
          if (isMounted()) {
            setProjects(_projects);
            setActiveProject(updatedProject);
          }
        }
      };

      updateProjectFn();
    },
    [config, projects, isMounted, setProjects, setActiveProject]
  );

  const reorderTasks = React.useCallback(
    (
      projectId: string,
      commands: IProjectCommand[],
      taskSortOrder: TASK_SORT_ORDER = "name-asc"
    ) => {
      const reorderTasksFn = async () => {
        await reorderTasksInDb(config, projectId, commands, taskSortOrder);
        const currentProjectIndex = projects.findIndex(
          (x) => x._id === projectId
        );
        const projectWithThisTask = projects[currentProjectIndex];

        if (projectWithThisTask) {
          const updatedProject: IProject = {
            ...projectWithThisTask,
            commands,
            taskSortOrder,
          };
          const _projects = [...projects];
          _projects.splice(currentProjectIndex, 1, updatedProject);
          setProjects(_projects);
          setActiveProject(updatedProject);
        }
      };
      reorderTasksFn();
    },
    [config, projects, setProjects, setActiveProject]
  );

  const addTask = React.useCallback(
    (projectId: string, task: IProjectCommand) => {
      const addTaskInFn = async (projectID, newTask) => {
        try {
          await saveTaskInDb(config, projectID, newTask);
          const currentProjectIndex = projects.findIndex(
            (x) => x._id === projectID
          );
          const projectWithThisTask = projects[currentProjectIndex];
          if (projectWithThisTask) {
            const updatedTasks = [newTask, ...projectWithThisTask.commands];
            const updatedProject: IProject = {
              ...projectWithThisTask,
              commands: updatedTasks,
            };
            const _projects = [...projects];
            _projects.splice(currentProjectIndex, 1, updatedProject);
            setProjects(_projects);
            setActiveProject(updatedProject);
          }
        } catch (error) {
          console.log("error:", error);
        }
      };
      addTaskInFn(projectId, task);
    },
    [config, projects, setProjects, setActiveProject]
  );

  const updateTask = React.useCallback(
    (projectId: string, taskId: string, task) => {
      const updateTaskFn = async (projectID, updatingTaskID, updatedTask) => {
        try {
          await updateTaskInDb(config, projectID, updatingTaskID, updatedTask);
          const currentProjectIndex = projects.findIndex(
            (x) => x._id === projectID
          );
          const projectWithThisTask = projects[currentProjectIndex];
          if (projectWithThisTask) {
            const taskIndex = projectWithThisTask.commands.findIndex(
              (iterTask) => iterTask._id === updatingTaskID
            );

            if (taskIndex < 0) {
              return;
            }

            const updatedTasks = [...projectWithThisTask.commands];

            updatedTasks.splice(taskIndex, 1, updatedTask);

            const updatedProject: IProject = {
              ...projectWithThisTask,
              commands: updatedTasks,
            };

            const _projects = [...projects];
            _projects.splice(currentProjectIndex, 1, updatedProject);
            setProjects(_projects);
            setActiveProject(updatedProject);
          }
        } catch (error) {
          console.log("error:", error);
        }
      };

      updateTaskFn(projectId, taskId, task);
    },
    [config, projects, setProjects, setActiveProject]
  );

  const addProject = React.useCallback(
    (projectData: any) => {
      const addProjectFn = async () => {
        const newProject = await saveProjectInDb(config, projectData);
        if (!newProject) {
          throw new Error(
            "Failed to add project. Something wrong with server."
          );
        }

        const copyOfProjects = projects.slice();
        const updatedProjects = [...copyOfProjects, newProject];
        setProjects(updatedProjects);
        setActiveProject(newProject);
      };
      addProjectFn();
    },
    [config, projects, setActiveProject, setProjects]
  );

  const deleteProject = React.useCallback(
    (projectId: string) => {
      const deleteProjectFn = async () => {
        if (!projectId) {
          throw new Error("ProjectID not passed to deleteProject");
        }
        await deleteProjectInDb(config, projectId);
        const newProjects = projects.filter(
          (x: IProject) => x._id !== projectId
        );
        setProjects(newProjects);
        if (newProjects && newProjects?.length > 0) {
          setActiveProject(newProjects[0]);
        } else {
          setActiveProject(initialProject);
        }
      };

      deleteProjectFn();
    },
    [config, projects, setProjects, setActiveProject, initialProject]
  );

  const startJob = React.useCallback(
    (command: IProjectCommand) => {
      const taskID = command._id;
      clearJobOutput(taskID);
      const shell = command.shell || activeProject.shell || config.shell || "";
      subscribeToTaskSocket(taskID, command, activeProject.path, shell);
      updateTask(activeProject._id, taskID, {
        ...command,
        lastExecutedAt: new Date(),
      });
    },
    [
      activeProject._id,
      activeProject.path,
      activeProject.shell,
      clearJobOutput,
      config.shell,
      subscribeToTaskSocket,
      updateTask,
    ]
  );

  const startTask = React.useCallback(
    (command: IProjectCommand) => {
      try {
        startJob(command);
      } catch (error) {
        console.log(`startTask error: `, error);
      }
    },
    [startJob]
  );

  const runAllStoppedTasks = React.useCallback(() => {
    const commandsInProject = activeProject.commands;
    commandsInProject.forEach((command) => {
      if (!isTaskRunning(command._id)) {
        startTask(command);
      }
    });
  }, [activeProject.commands, isTaskRunning, startTask]);

  const stopAllRunningTasks = React.useCallback(() => {
    const commandsInProject = activeProject.commands;
    commandsInProject.forEach((command) => {
      if (isTaskRunning(command._id)) {
        stopTask(command);
      }
    });
  }, [activeProject, stopTask, isTaskRunning]);

  React.useEffect(() => {
    (async () => {
      try {
        await updateRunningTaskCountInDB(config, totalRunningTaskCount);
        if (isRunningInElectron()) {
          const { ipcRenderer } = require("electron");
          ipcRenderer.sendSync(`update-task-count`, totalRunningTaskCount);
        }
      } catch (error) {
        console.log("error updating task count:", error);
      }
    })();
  }, [config, totalRunningTaskCount]);

  React.useEffect(() => {
    if (!projects) {
      return;
    }

    const {
      runningTasksPerProject,
      totalRunningTaskCount: nextTotalRunningTaskCount,
    } = getRunningTasksCountForProjects(projects, runningTasks);

    setProjectsRunningTaskCount(runningTasksPerProject);
    setTotalRunningTaskCount(nextTotalRunningTaskCount);
  }, [runningTasks, projects]);

  React.useEffect(() => {
    updateProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = React.useMemo(() => {
    return {
      projects,
      projectsRunningTaskCount,
      activeProject,
      setActiveProject,
      setProjects,
      updateProjects,
      loadingProjects,
      addTask,
      updateTask,
      deleteTask,
      addProject,
      deleteProject,
      reorderTasks,
      renameProject,
      updateProject,
      runAllStoppedTasks,
      stopAllRunningTasks,
      totalRunningTaskCount,
    };
  }, [
    projects,
    projectsRunningTaskCount,
    activeProject,
    setActiveProject,
    setProjects,
    updateProjects,
    loadingProjects,
    addTask,
    updateTask,
    deleteTask,
    addProject,
    deleteProject,
    reorderTasks,
    renameProject,
    updateProject,
    runAllStoppedTasks,
    stopAllRunningTasks,
    totalRunningTaskCount,
  ]);

  return <ProjectContext.Provider value={value} {...props} />;
}

function useProjects() {
  const context = React.useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }

  return context;
}

export { ProjectsProvider, useProjects };
