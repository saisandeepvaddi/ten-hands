import {
    Alert,
    Alignment,
    Button,
    Icon,
    Menu,
    MenuDivider,
    MenuItem,
    Navbar,
    Overlay,
    Popover,
} from "@blueprintjs/core";
import Axios from "axios";
import React from "react";
import styled from "styled-components";
import { isRunningInElectron } from "../../utils/electron";
import NewCommandDrawer from "../NewCommandDrawer";
import { useConfig } from "../shared/Config";
import { useProjects } from "../shared/Projects";
import { useTheme } from "../shared/Themes";

// Have to use require because it's type-definition doesn't have function that allows path
// Do not want to update node_module's file.
// tslint:disable-next-line: no-var-requires
const getRepoInfo = require("git-repo-info");

interface IProjectTopbarProps {
    activeProject: IProject;
}

const GitBranchContainer = styled.div`
    display: flex;
    align-items: center;
    & > .git-branch-name {
        padding-left: 5px;
    }
`;

const ProjectTopbar: React.FC<IProjectTopbarProps> = React.memo(({ activeProject }) => {
    const [isDeleteAlertOpen, setDeleteAlertOpen] = React.useState(false);
    const [commandsOrderModalOpen, setCommandsOrderModalOpen] = React.useState(false);
    const { theme } = useTheme();
    const { config } = useConfig();
    const [isDrawerOpen, setDrawerOpen] = React.useState(false);

    const { updateProjects } = useProjects();
    const deleteProject = React.useCallback(
        async shouldDelete => {
            try {
                if (shouldDelete) {
                    console.info(`Deleting project: `, activeProject);
                    await Axios.delete(`http://localhost:${config.port}/projects/${activeProject._id}`);
                    await updateProjects();
                    setDeleteAlertOpen(false);
                }
            } catch (error) {
                console.error(`Error deleting project: `, error);
            }
        },
        [activeProject, updateProjects],
    );

    const getGitBranch = React.useCallback(() => {
        if (isRunningInElectron()) {
            const projectPath = activeProject.path;
            const gitInfo = getRepoInfo(projectPath);
            return gitInfo.branch || "";
        } else {
            return "";
        }
    }, [activeProject]);
    return (
        <>
            <Navbar>
                <Navbar.Group>
                    <Navbar.Heading data-testid="active-project-name">{activeProject.name}</Navbar.Heading>
                    <Navbar.Heading data-testid="active-project-git-branch">
                        {getGitBranch() ? (
                            <GitBranchContainer>
                                <Navbar.Divider style={{ paddingRight: 10 }} /> <Icon icon="git-branch" />
                                {<span className="git-branch-name">{getGitBranch()}</span>}
                            </GitBranchContainer>
                        ) : null}
                    </Navbar.Heading>
                </Navbar.Group>
                <Navbar.Group align={Alignment.RIGHT}>
                    <Button
                        onClick={() => setDrawerOpen(true)}
                        icon="add"
                        intent="success"
                        text="New Command"
                        minimal={true}
                    />
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
                            <MenuDivider title="Layout" />
                            <MenuItem
                                icon="list"
                                text="Change Commands order"
                                onClick={() => setCommandsOrderModalOpen(true)}
                            />
                            <MenuDivider title="Danger" />
                            <MenuItem
                                icon="trash"
                                text="Delete Project"
                                intent="danger"
                                onClick={() => setDeleteAlertOpen(true)}
                            />
                        </Menu>
                    </Popover>
                    <Overlay isOpen={commandsOrderModalOpen} onClose={() => setCommandsOrderModalOpen(false)} />
                </Navbar.Group>
            </Navbar>
            <NewCommandDrawer isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
        </>
    );
});

export default ProjectTopbar;
