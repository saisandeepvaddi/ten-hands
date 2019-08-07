import Axios from "axios";
import React from "react";
import { useConfig } from "./Config";

interface IProjectContextValue {
    projects: IProject[];
    activeProject: IProject;
    setActiveProject: (activeProject: IProject) => void;
    setProjects: any;
    updateProjects: () => void;
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

    React.useEffect(() => {
        async function updateNewProjects() {
            await updateProjects();
        }
        updateNewProjects();
    }, []); // DO NOT ADD DEPENDENCY. IT WILL RUN INFINITE. NEED TO FIGURE OUT ANOTHER WAY

    const value = React.useMemo(() => {
        return {
            projects,
            activeProject,
            setActiveProject,
            setProjects,
            updateProjects,
            loadingProjects,
        };
    }, [projects, activeProject, setActiveProject, setProjects, updateProjects, loadingProjects]);

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
