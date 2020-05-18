import Axios, { AxiosResponse } from "axios";

export const getProjects = async (config: IConfig): Promise<IProject[]> => {
  try {
    const response: AxiosResponse = await Axios.get(
      `http://localhost:${config.port}/projects`
    );
    const projects: IProject[] = response.data;
    return projects;
  } catch (error) {
    console.error("getProjects error:", error);
    throw error;
  }
};

export const saveProjectInDb = async (
  config: IConfig,
  projectData: any
): Promise<IProject> => {
  try {
    const responseData: AxiosResponse = await Axios({
      method: "post",
      baseURL: `http://localhost:${config.port}`,
      url: "projects",
      data: projectData,
    });

    // Take data from backend so we know it's committed to database.
    const newProject = responseData.data;
    return newProject;
  } catch (error) {
    console.error("saveProjectInDb error:", error);
    throw error;
  }
};

export const renameProjectInDb = async (
  config: IConfig,
  projectId: string,
  newName: string
): Promise<IProject> => {
  try {
    const responseData: AxiosResponse = await Axios({
      method: "patch",
      url: `http://localhost:${config.port}/projects/${projectId}`,
      data: {
        name: newName,
      },
    });
    const updatedProject = responseData.data;
    return updatedProject;
  } catch (error) {
    console.log("renameProjectInDb error:", error);
    throw error;
  }
};
export const updateProjectInDb = async (
  config: IConfig,
  projectId: string,
  newProjectData: IProject
): Promise<IProject> => {
  try {
    const responseData: AxiosResponse = await Axios({
      method: "put",
      url: `http://localhost:${config.port}/projects/${projectId}`,
      data: newProjectData,
    });
    const updatedProject = responseData.data;
    return updatedProject;
  } catch (error) {
    console.log("updateProjectInDb error:", error);
    throw error;
  }
};

export const deleteProjectInDb = async (config: IConfig, projectId: string) => {
  try {
    await Axios.delete(`http://localhost:${config.port}/projects/${projectId}`);
  } catch (error) {
    console.error("deleteProjectInDb error:", error);
    throw error;
  }
};

export const deleteTaskInDb = async (
  config: IConfig,
  projectId: string,
  taskId: string
) => {
  try {
    await Axios.delete(
      `http://localhost:${config.port}/projects/${projectId}/commands/${taskId}`
    );
  } catch (error) {
    console.error("deleteTask error:", error);
    throw error;
  }
};

export const reorderTasksInDb = async (
  config: IConfig,
  projectId: string,
  commands: IProjectCommand[],
  taskSortOrder: TASK_SORT_ORDER = "name-asc"
) => {
  try {
    await Axios.post(
      `http://localhost:${config.port}/projects/${projectId}/commands/reorder`,
      {
        commands,
        taskSortOrder,
      }
    );
  } catch (error) {
    console.error("reorderTasks error:", error);
    throw error;
  }
};

export const saveTaskInDb = async (
  config: IConfig,
  activeProjectId: string,
  newTask: IProjectCommand
): Promise<any> => {
  try {
    const responseData: AxiosResponse = await Axios({
      timeout: 5000,
      method: "post",
      baseURL: `http://localhost:${config.port}`,
      url: `projects/${activeProjectId}/commands`,
      data: newTask,
    });

    const updatedProject = responseData.data;
    return updatedProject;
  } catch (error) {
    console.error("saveProjectInDb error:", error);
    throw error;
  }
};

export const updateTaskInDb = async (
  config: IConfig,
  activeProjectId: string,
  taskId: string,
  newTask: IProjectCommand
): Promise<any> => {
  try {
    const responseData: AxiosResponse = await Axios({
      timeout: 5000,
      method: "put",
      baseURL: `http://localhost:${config.port}`,
      url: `projects/${activeProjectId}/commands/${taskId}`,
      data: newTask,
    });

    const updatedProject = responseData.data;
    return updatedProject;
  } catch (error) {
    console.error("saveProjectInDb error:", error);
    throw error;
  }
};

export const reorderProjectsInDb = async (
  config: IConfig,
  projectIds: string[]
) => {
  try {
    await Axios.post(`http://localhost:${config.port}/projects/reorder`, {
      projectIds,
    });
  } catch (error) {
    console.error("reorderProjects error:", error);
    throw error;
  }
};

export const checkIfValidPath = async (config: IConfig, path: string) => {
  try {
    const response = await Axios.post(
      `http://localhost:${config.port}/utils/is-valid-path`,
      {
        path,
      }
    );
    return response.data;
  } catch (error) {
    console.log("checkIfValidPath error:", error);
    throw error;
  }
};

export const getGitRepo = async (config: IConfig, path: string) => {
  try {
    const response = await Axios.post(
      `http://localhost:${config.port}/utils/git-info`,
      {
        path,
      }
    );
    return response.data;
  } catch (error) {
    console.log("error:", error);
    throw error;
  }
};

export const updateRunningTaskCountInDB = async (
  config: IConfig,
  count: number
) => {
  try {
    const response = await Axios.put(
      `http://localhost:${config.port}/utils/running-task-count`,
      {
        count,
      }
    );
    return response.data;
  } catch (error) {
    console.log("updateRunningTaskCountInDB error:", error);
    throw error;
  }
};
