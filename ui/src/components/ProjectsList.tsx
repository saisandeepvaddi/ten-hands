import { Classes, Divider, H3, InputGroup, Tab, Tabs } from "@blueprintjs/core";
import React from "react";

interface IProjectProps {
    projects: IProject[];
    setActiveProject: any;
}

const ProjectsList: React.FC<IProjectProps> = ({ projects, setActiveProject }) => {
    const changeActiveProject = projectId => {
        const activeProjectWithId = projects.filter(project => project.id === projectId);
        setActiveProject(activeProjectWithId);
    };
    return (
        <Tabs vertical={true} className={`w-100`} large={true} onChange={changeActiveProject}>
            {/* <InputGroup className={Classes.FILL} type="text" placeholder="Search..." /> */}
            <Divider />
            {projects.map(project => (
                <Tab key={project.id} id={project.id} title={project.name} />
            ))}
        </Tabs>
    );
};

export default ProjectsList;
