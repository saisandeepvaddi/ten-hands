import Axios from "axios";
import React from "react";

interface IProjectContextValue {
    projects: IProject[];
    activeProject: IProject;
    setActiveProject: (activeProject: IProject) => void;
    setProjects: any;
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
        commands: [],
    };

    const [activeProject, setActiveProject] = React.useState(initialProject);
    const [projects, setProjects] = React.useState([]);

    React.useEffect(() => {
        async function getProjects() {
            try {
                const response = await Axios.get("http://localhost:1010/projects");
                const receivedProjects = response.data;
                if (receivedProjects.length > 0) {
                    setProjects(receivedProjects);
                    setActiveProject(receivedProjects[0]);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getProjects();
    }, []);

    const value = React.useMemo(() => {
        return {
            projects,
            activeProject,
            setActiveProject,
            setProjects,
        };
    }, [projects, activeProject]);

    return <ProjectContext.Provider value={value} {...props} />;
}

function useProjects() {
    const context = React.useContext(ProjectContext);
    if (!context) {
        throw new Error("useProjects must be used within a ProjectsProvider");
    }

    const { projects, activeProject, setActiveProject, setProjects } = context;

    return {
        projects,
        activeProject,
        setActiveProject,
        setProjects,
    };
}

export { ProjectsProvider, useProjects };
