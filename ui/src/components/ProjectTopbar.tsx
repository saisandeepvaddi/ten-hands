import { Alignment, Button, Navbar } from "@blueprintjs/core";
import React from "react";

interface IProjectTopbarProps {
    activeProject: IProject;
}

const ProjectTopbar: React.FC<IProjectTopbarProps> = ({ activeProject }) => {
    return (
        <Navbar>
            <Navbar.Group>
                <Navbar.Heading data-testid="active-project-name">{activeProject.name}</Navbar.Heading>
                <Navbar.Divider />
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Button icon="add" intent="success" text="New Command" />
                <Navbar.Divider />
                <Button icon="grid-view" onClick={() => {}} minimal={true} />
            </Navbar.Group>
        </Navbar>
    );
};

export default ProjectTopbar;
