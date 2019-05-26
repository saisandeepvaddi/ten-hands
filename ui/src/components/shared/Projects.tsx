import Axios from "axios";
import React from "react";

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

    const [activeProject, setActiveProject] = React.useState(initialProject);
    const [projects, setProjects] = React.useState([]);
    const [loadingProjects, setLoadingProjects] = React.useState(true);
    const updateProjects = React.useCallback(async () => {
        try {
            setLoadingProjects(true);
            const response = await Axios.get("http://localhost:1010/projects");
            const receivedProjects = response.data;
            if (receivedProjects.length > 0) {
                setProjects(receivedProjects);
                setActiveProject(receivedProjects[0]);
            } else {
                setProjects([]);
                setActiveProject(initialProject);
            }
            setLoadingProjects(false);
        } catch (error) {
            console.error(error);
        }
    }, [initialProject]);
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
