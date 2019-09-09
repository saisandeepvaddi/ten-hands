import Axios, { AxiosResponse } from "axios";

export const getProjects = async (config: IConfig): Promise<IProject[]> => {
    try {
        const response: AxiosResponse = await Axios.get(`http://localhost:${config.port}/projects`);
        const projects: IProject[] = response.data;
        return projects;
    } catch (error) {
        console.error("getProjects error:", error);
        throw error;
    }
};

export const saveProjectInDb = async (config: IConfig, projectData: any): Promise<IProject> => {
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

export const deleteProjectInDb = async (config: IConfig, projectId: string) => {
    try {
        await Axios.delete(`http://localhost:${config.port}/projects/${projectId}`);
    } catch (error) {
        console.error("deleteProjectInDb error:", error);
        throw error;
    }
};

export const deleteTaskInDb = async (config: IConfig, projectId: string, taskId: string) => {
    try {
        await Axios.delete(`http://localhost:${config.port}/projects/${projectId}/commands/${taskId}`);
    } catch (error) {
        console.error("deleteTask error:", error);
        throw error;
    }
};

export const reorderTasksInDb = async (config: IConfig, projectId: string, commands: IProjectCommand[]) => {
    try {
        await Axios.post(`http://localhost:${config.port}/projects/${projectId}/commands/reorder`, {
            commands,
        });
    } catch (error) {
        console.error("reorderTasks error:", error);
        throw error;
    }
};
