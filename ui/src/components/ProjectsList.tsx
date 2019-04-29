import { Divider, Tab, Tabs } from "@blueprintjs/core";
import React from "react";

interface IProjectProps {
    projects: IProject[];
    setActiveProject: any;
}

const ProjectsList: React.FC<IProjectProps> = ({ projects, setActiveProject }) => {
    const changeActiveProject = projectId => {
        const activeProjectWithId = projects.find(project => project.id === projectId);
        setActiveProject(activeProjectWithId);
    };
    if (projects.length === 0) {
        return <div />;
    }
    return (
        <Tabs
            vertical={true}
            className={`w-100`}
            large={true}
            onChange={changeActiveProject}
            defaultSelectedTabId={projects[0].id}
        >
            {/* <InputGroup className={Classes.FILL} type="text" placeholder="Search..." /> */}
            <Divider />
            {projects.map(project => (
                <Tab key={project.id} id={project.id} title={project.name} />
            ))}
        </Tabs>
    );
};

export default ProjectsList;
