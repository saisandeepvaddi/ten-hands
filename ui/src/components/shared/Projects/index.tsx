import React from "react";
import { useApi } from "../../../utils/api";

interface IProjectContextValue {
    projects: IProject[];
    activeProject: IProject;
    setActiveProject: (activeProject: IProject) => void;
}

interface IProjectsProviderProps {
    value?: IProjectContextValue;
    children: React.ReactNode;
}

export const ProjectContext = React.createContext<IProjectContextValue | undefined>(undefined);

function ProjectsProvider(props: IProjectsProviderProps) {
    const { data: projects } = useApi("projects");
    const initialProject: IProject = {
        _id: "",
        name: "",
        type: "",
        commands: [],
    };

    const [activeProject, setActiveProject] = React.useState(initialProject);

    React.useEffect(() => {
        if (projects.length > 0) {
            setActiveProject(projects[0]);
        }
    }, [projects]);

    const value = React.useMemo(() => {
        return {
            projects,
            activeProject,
            setActiveProject,
        };
    }, [projects, activeProject]);

    return <ProjectContext.Provider value={value} {...props} />;
}

function useProjects() {
    const context = React.useContext(ProjectContext);
    if (!context) {
        throw new Error("useProjects must be used within a ProjectsProvider");
    }

    const { projects, activeProject, setActiveProject } = context;

    return {
        projects,
        activeProject,
        setActiveProject,
    };
}

export { ProjectsProvider, useProjects };
