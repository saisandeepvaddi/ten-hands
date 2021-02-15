import { getFakeProjects } from "../../../utils/test-utils";

export const getProjects = async (_config: IConfig): Promise<IProject[]> => {
  try {
    const projects = getFakeProjects(5);
    return projects;
  } catch (error) {
    console.error("getProjects error:", error);
    throw error;
  }
};

export const saveProjectInDb = async (
  _config: IConfig,
  _projectData: any
): Promise<IProject> => {
  try {
    const project = getFakeProjects(1)[0];
    return project;
  } catch (error) {
    console.error("saveProjectInDb error:", error);
    throw error;
  }
};

export const renameProjectInDb = async (
  _config: IConfig,
  _projectId: string,
  newName: string
): Promise<IProject> => {
  try {
    const project = getFakeProjects(1)[0];
    return { ...project, name: newName };
  } catch (error) {
    console.error("saveProjectInDb error:", error);
    throw error;
  }
};

export const deleteProjectInDb = async (
  _config: IConfig,
  _projectId: string
) => {
  try {
    Promise.resolve();
  } catch (error) {
    console.error("deleteProjectInDb error:", error);
    throw error;
  }
};

export const deleteTaskInDb = async (
  _config: IConfig,
  _projectId: string,
  _taskId: string
) => {
  try {
    Promise.resolve();
  } catch (error) {
    console.error("deleteTask error:", error);
    throw error;
  }
};

export const reorderTasksInDb = async (
  _config: IConfig,
  _projectId: string,
  _commands: IProjectCommand[]
) => {
  try {
    Promise.resolve();
  } catch (error) {
    console.error("reorderTasks error:", error);
    throw error;
  }
};

export const saveTaskInDb = async (
  _config: IConfig,
  _activeProjectId: string,
  _newTask: IProjectCommand
): Promise<any> => {
  try {
    return getFakeProjects(1)[0];
  } catch (error) {
    console.error("saveProjectInDb error:", error);
    throw error;
  }
};

export const reorderProjectsInDb = async (
  _config: IConfig,
  projectIds: string[]
) => {
  try {
    return projectIds;
  } catch (error) {
    console.error("reorderProjects error:", error);
    throw error;
  }
};

export const checkIfValidPath = async (_config: IConfig, _path: string) => {
  try {
    return {
      isValid: true,
    };
  } catch (error) {
    console.log("checkIfValidPath error:", error);
    throw error;
  }
};

export const getGitRepo = async (_config: IConfig, _path: string) => {
  try {
    return {
      branch: "fake-branch",
    };
  } catch (error) {
    console.log("error:", error);
    throw error;
  }
};

export const allMockAjaxFunctions = {
  getProjects,
  saveProjectInDb,
  deleteProjectInDb,
  deleteTaskInDb,
  reorderTasksInDb,
  saveTaskInDb,
  reorderProjectsInDb,
  checkIfValidPath,
  getGitRepo,
};
