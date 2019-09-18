import { getFakeProjects } from "../../../utils/test-utils";

export const getProjects = async (config: IConfig): Promise<IProject[]> => {
    try {
        const projects = getFakeProjects(5);
        return projects;
    } catch (error) {
        console.error("getProjects error:", error);
        throw error;
    }
};

export const saveProjectInDb = async (config: IConfig, projectData: any): Promise<IProject> => {
    try {
        const project = getFakeProjects(1)[0];
        return project;
    } catch (error) {
        console.error("saveProjectInDb error:", error);
        throw error;
    }
};

export const deleteProjectInDb = async (config: IConfig, projectId: string) => {
    try {
        Promise.resolve();
    } catch (error) {
        console.error("deleteProjectInDb error:", error);
        throw error;
    }
};

export const deleteTaskInDb = async (config: IConfig, projectId: string, taskId: string) => {
    try {
        Promise.resolve();
    } catch (error) {
        console.error("deleteTask error:", error);
        throw error;
    }
};

export const reorderTasksInDb = async (config: IConfig, projectId: string, commands: IProjectCommand[]) => {
    try {
        Promise.resolve();
    } catch (error) {
        console.error("reorderTasks error:", error);
        throw error;
    }
};

export const saveTaskInDb = async (
    config: IConfig,
    activeProjectId: string,
    newTask: IProjectCommand,
): Promise<any> => {
    try {
        return getFakeProjects(1)[0];
    } catch (error) {
        console.error("saveProjectInDb error:", error);
        throw error;
    }
};

export const reorderProjectsInDb = async (config: IConfig, projectIds: string[]) => {
    try {
        return projectIds;
    } catch (error) {
        console.error("reorderProjects error:", error);
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
};
