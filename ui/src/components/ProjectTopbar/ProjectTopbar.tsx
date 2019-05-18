import { Alert, Alignment, Button, Menu, MenuDivider, MenuItem, Navbar, Popover } from "@blueprintjs/core";
import Axios from "axios";
import React from "react";
import { useProjects } from "../shared/Projects";
import { useTheme } from "../shared/Themes";

interface IProjectTopbarProps {
    activeProject: IProject;
}

const ProjectTopbar: React.FC<IProjectTopbarProps> = React.memo(({ activeProject }) => {
    const [isDeleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
    const { theme } = useTheme();
    const { updateProjects, setActiveProject, projects } = useProjects();
    const deleteProject = React.useCallback(
        async shouldDelete => {
            try {
                if (shouldDelete) {
                    console.info(`Deleting project: `, activeProject);
                    await Axios.delete(`http://localhost:1010/projects/${activeProject._id}`);
                    await updateProjects();
                    setDeleteAlertOpen(false);
                }
            } catch (error) {
                console.error(`Error deleting project: `, error);
            }
        },
        [activeProject, projects],
    );
    return (
        <Navbar>
            <Navbar.Group>
                <Navbar.Heading data-testid="active-project-name">{activeProject.name}</Navbar.Heading>
                <Navbar.Divider />
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                {/* <Button icon="add" intent="success" text="New Command" minimal={true} /> */}
                <Navbar.Divider />
                <Alert
                    cancelButtonText="Cancel"
                    confirmButtonText="Yes, Delete"
                    className={theme}
                    icon="trash"
                    intent="danger"
                    isOpen={isDeleteAlertOpen}
                    onCancel={() => setDeleteAlertOpen(false)}
                    onConfirm={() => deleteProject(true)}
                >
                    <p>
                        Are you sure you want to delete project <b>{activeProject.name}</b> ?
                    </p>
                </Alert>
                <Popover position="left-top">
                    <Button icon="cog" minimal={true} />
                    <Menu key="menu">
                        {/* <MenuDivider title="Layout" />
                        <MenuItem icon="list" text="Fixed Height output" /> */}
                        <MenuDivider title="Danger" />
                        <MenuItem
                            icon="trash"
                            text="Delete Project"
                            intent="danger"
                            onClick={() => setDeleteAlertOpen(true)}
                        />
                    </Menu>
                </Popover>
            </Navbar.Group>
        </Navbar>
    );
});

export default ProjectTopbar;
