import Axios, { AxiosResponse } from "axios";
import React from "react";
import { useConfig } from "./Config";

interface IProjectContextValue {
    projects: IProject[];
    activeProject: IProject;
    setActiveProject: (activeProject: IProject) => void;
    setProjects: any;
    updateProjects: () => void;
    deleteTask: (projectId: string, taskId: string) => Promise<any>;
    addProject: (data: any) => Promise<any>;
    deleteProject: (projectId: string) => Promise<any>;
    reorderTasks: (projectId: string, newTasks: IProjectCommand[]) => Promise<any>;
    loadingProjects: boolean;
}

interface IProjectsProviderProps {
    value?: IProjectContextValue;
    children: React.ReactNode;
}

export const ProjectContext = React.createContext<IProjectContextValue | undefined>(undefined);

function ProjectsProvider(props: IProjectsProviderProps) {
    const initialProject: IProject = {
        _id: "",
        name: "",
        type: "",
        path: "",
        commands: [],
    };

    const { config } = useConfig();
    const [activeProject, setActiveProject] = React.useState(initialProject);
    const [projects, setProjects] = React.useState<IProject[]>([]);
    const [loadingProjects, setLoadingProjects] = React.useState(true);

    React.useEffect(() => {
        console.log("check projects:", projects);
    }, [projects]);

    const updateProjects = React.useCallback(() => {
        const reloadProjects = async () => {
            try {
                setLoadingProjects(true);
                const response = await Axios.get(`http://localhost:${config.port}/projects`);
                console.log("response:", response);
                const receivedProjects: IProject[] = response.data;
                if (receivedProjects.length > 0) {
                    setProjects(receivedProjects);
                    if (activeProject._id === "") {
                        setActiveProject(receivedProjects[0]);
                    } else {
                        // Commands order might be changed.
                        const newActiveProject = receivedProjects.find(project => project._id === activeProject._id);

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

                setLoadingProjects(false);
            } catch (error) {
                console.error(error);
            }
        };
        reloadProjects();
    }, [projects, activeProject]);

    const deleteTask = async (projectId, taskId) => {
        await Axios.delete(`http://localhost:${config.port}/projects/${projectId}/commands/${taskId}`);

        const currentProjectIndex = projects.findIndex(x => x._id === projectId);
        const projectWithThisTask = projects[currentProjectIndex];

        if (projectWithThisTask) {
            const currentTasks = [...projectWithThisTask.commands];
            const updatedTasks = currentTasks.filter((x: IProjectCommand) => x._id !== taskId);
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

    const reorderTasks = async (projectId: string, commands: IProjectCommand[]) => {
        await Axios.post(`http://localhost:${config.port}/projects/${projectId}/commands/reorder`, {
            commands,
        });

        const currentProjectIndex = projects.findIndex(x => x._id === projectId);
        const projectWithThisTask = projects[currentProjectIndex];

        if (projectWithThisTask) {
            const updatedProject: IProject = {
                ...projectWithThisTask,
                commands,
            };
            const _projects = [...projects];
            _projects.splice(currentProjectIndex, 1, updatedProject);
            setProjects(_projects);
            setActiveProject(updatedProject);
        }
    };

    const addProject = async (projectData: any) => {
        const responseData: AxiosResponse = await Axios({
            method: "post",
            baseURL: `http://localhost:${config.port}`,
            url: "projects",
            data: projectData,
        });

        // Take data from backend so we know it's committed to database.
        const newProject = responseData.data;

        if (!newProject) {
            throw new Error("Failed to add project. Something wrong with server.");
        }

        const copyOfProjects = projects.slice();
        console.log("copyOfProjects:", copyOfProjects);

        const updatedProjects = [...copyOfProjects, newProject];
        console.log("updatedProjects:", updatedProjects);
        setProjects(updatedProjects);
        setActiveProject(newProject);
    };

    const deleteProject = async (projectId: string) => {
        if (!projectId) {
            throw new Error("ProjectID not passed to deleteProject");
        }
        await Axios.delete(`http://localhost:${config.port}/projects/${projectId}`);
        const newProjects = projects.filter((x: IProject) => x._id !== projectId);
        setProjects(newProjects);
        if (newProjects && newProjects.length > 0) {
            setActiveProject(newProjects[0]);
        } else {
            setActiveProject(initialProject);
        }
    };

    React.useEffect(() => {
        async function updateNewProjects() {
            await updateProjects();
        }
        updateNewProjects();
    }, []);

    const value = React.useMemo(() => {
        return {
            projects,
            activeProject,
            setActiveProject,
            setProjects,
            updateProjects,
            loadingProjects,
            deleteTask,
            addProject,
            deleteProject,
            reorderTasks,
        };
    }, [
        projects,
        activeProject,
        setActiveProject,
        setProjects,
        updateProjects,
        loadingProjects,
        deleteTask,
        addProject,
        deleteProject,
        reorderTasks,
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
