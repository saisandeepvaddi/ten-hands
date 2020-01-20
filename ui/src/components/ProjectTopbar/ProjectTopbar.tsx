import {
  Alert,
  Alignment,
  Button,
  Dialog,
  FormGroup,
  Icon,
  InputGroup,
  Menu,
  MenuDivider,
  MenuItem,
  Navbar,
  Popover,
  Tooltip
} from "@blueprintjs/core";
import React, { useEffect } from "react";
import styled from "styled-components";
import { isRunningInElectron, openInExplorer } from "../../utils/electron";
import { hasProjectWithSameName } from "../../utils/projects";
import NewCommandDrawer from "../NewCommandDrawer";
import { getGitRepo } from "../shared/API";
import { useConfig } from "../shared/stores/ConfigStore";
import { useProjects } from "../shared/stores/ProjectStore";
import { useTheme } from "../shared/stores/ThemeStore";
import CommandOrderListContainer from "./CommandOrderListContainer";
import { useMountedState } from "../shared/hooks";

interface IProjectTopbarProps {
  activeProject: IProject;
}

const GitBranchContainer = styled.div`
  display: flex;
  align-items: center;
  & > .git-branch-name {
    padding-left: 5px;
    padding-right: 5px;
  }
`;

const ProjectTopbar: React.FC<IProjectTopbarProps> = React.memo(
  ({ activeProject }) => {
    const [isDeleteAlertOpen, setDeleteAlertOpen] = React.useState<boolean>(
      false
    );
    const isMounted = useMountedState();
    const [commandsOrderModalOpen, setCommandsOrderModalOpen] = React.useState<
      boolean
    >(false);
    const [updatedProjectName, setUpdatedProjectName] = React.useState<string>(
      ""
    );
    const [renameProjectModalOpen, setRenameProjectModalOpen] = React.useState<
      boolean
    >(false);
    const { theme } = useTheme();
    const [isDrawerOpen, setDrawerOpen] = React.useState<boolean>(false);
    const [projectNameError, setProjectNameError] = React.useState<string>("");
    const [isRenaming, setIsRenaming] = React.useState<boolean>(false);
    const [gitBranch, setGitBranch] = React.useState<string>("");
    const { config } = useConfig();
    let checkBranchTimerRef = React.useRef<number>();

    const {
      deleteProject,
      projects,
      renameProject,
      projectsRunningTaskCount
    } = useProjects();

    const shouldDeleteProject = async shouldDelete => {
      try {
        if (shouldDelete) {
          deleteProject(activeProject._id!);
          setDeleteAlertOpen(false);
        }
      } catch (error) {
        console.error(`Error deleting project: `, error);
      }
    };

    const handleChangeOrderModalClose = () => {
      setCommandsOrderModalOpen(false);
    };

    const handleRenameProjectModalClose = () => {
      setProjectNameError("");
      setUpdatedProjectName("");
      setRenameProjectModalOpen(false);
    };

    const validateProjectName = value => {
      let error = "";
      if (!value) {
        error = "Project name cannot be empty";
      }

      if (hasProjectWithSameName(projects, value)) {
        error = "Project name already exists";
      }

      return error;
    };

    const updateProjectName = async e => {
      e.preventDefault();
      try {
        setIsRenaming(true);

        const projectNameError = validateProjectName(updatedProjectName);

        if (projectNameError) {
          setProjectNameError(projectNameError);
          return;
        }

        await renameProject(activeProject._id!, updatedProjectName);

        handleRenameProjectModalClose();
      } catch (error) {
        console.log("error:", error);
        if (isMounted()) {
          setProjectNameError(error.message);
        }
      } finally {
        if (isMounted()) {
          setIsRenaming(false);
        }
      }
    };

    let updateGitBranch = React.useCallback(() => {
      (async () => {
        try {
          const projectPath = activeProject.path;
          const gitInfo = await getGitRepo(config, projectPath);
          if (isMounted()) {
            setGitBranch(gitInfo.branch || "");
          }
        } catch (error) {
          console.log("getGitInfo error:", error);
          if (isMounted()) {
            setGitBranch("");
          }
        }
      })();
    }, [activeProject]);

    useEffect(() => {
      updateGitBranch();

      checkBranchTimerRef.current = setInterval(() => {
        updateGitBranch();
      }, 2000);

      return () => {
        if (checkBranchTimerRef.current) {
          clearInterval(checkBranchTimerRef.current);
        }
      };
    }, [activeProject]);

    return (
      <React.Fragment>
        <Navbar>
          <Navbar.Group>
            <Navbar.Heading data-testid="active-project-name">
              {activeProject.name}
            </Navbar.Heading>
            {isRunningInElectron() ? (
              <Tooltip content="Open project in file explorer">
                <Button
                  data-testid="open-project-directory-button"
                  icon="folder-shared-open"
                  minimal={true}
                  onClick={() => openInExplorer(activeProject.path)}
                />
              </Tooltip>
            ) : null}
            <Navbar.Heading data-testid="active-project-git-branch">
              {gitBranch ? (
                <GitBranchContainer>
                  <Navbar.Divider style={{ paddingRight: 10 }} />{" "}
                  <Icon icon="git-branch" />
                  {<span className="git-branch-name">{gitBranch}</span>}
                </GitBranchContainer>
              ) : null}
            </Navbar.Heading>
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            <Button
              onClick={() => setDrawerOpen(true)}
              icon="add"
              intent="success"
              text="New Task"
              minimal={true}
              data-testid="new-task-button"
            />
            <Navbar.Divider />
            <Popover position="left-top">
              <Button
                icon="cog"
                minimal={true}
                data-testid="project-settings-button"
              />
              <Menu key="menu">
                <MenuDivider title="Edit" />
                <MenuItem
                  data-testid="rename-project-menu-item"
                  icon="edit"
                  text="Rename Project"
                  onClick={() => setRenameProjectModalOpen(true)}
                />
                <MenuDivider title="Layout" />
                <MenuItem
                  data-testid="change-tasks-order-menu-item"
                  icon="sort"
                  text="Change Tasks Order"
                  onClick={() => setCommandsOrderModalOpen(true)}
                />
                <MenuDivider title="Danger" />
                <MenuItem
                  data-testid="delete-project-menu-item"
                  icon="trash"
                  text="Delete Project"
                  intent="danger"
                  onClick={() => setDeleteAlertOpen(true)}
                  title={
                    projectsRunningTaskCount[activeProject._id!] > 0
                      ? "Cannot delete project while tasks are running."
                      : undefined
                  }
                  disabled={projectsRunningTaskCount[activeProject._id!] > 0}
                />
              </Menu>
            </Popover>
          </Navbar.Group>
        </Navbar>
        <Dialog
          title="Change Tasks Order"
          icon={"numbered-list"}
          className={theme}
          isOpen={commandsOrderModalOpen}
          onClose={handleChangeOrderModalClose}
        >
          <CommandOrderListContainer activeProject={activeProject} />
        </Dialog>
        <Alert
          cancelButtonText="Cancel"
          confirmButtonText="Yes, Delete"
          className={theme}
          icon="trash"
          intent="danger"
          isOpen={isDeleteAlertOpen}
          onCancel={() => setDeleteAlertOpen(false)}
          onConfirm={() => shouldDeleteProject(true)}
        >
          <p data-testid="delete-project-warning">
            Are you sure you want to delete project <b>{activeProject.name}</b>?
          </p>
        </Alert>
        <NewCommandDrawer
          isDrawerOpen={isDrawerOpen}
          setDrawerOpen={setDrawerOpen}
        />
        <Dialog
          title={`Rename project: ${activeProject.name}`}
          icon="edit"
          className={theme}
          isOpen={renameProjectModalOpen}
          onClose={handleRenameProjectModalClose}
          style={{ paddingBottom: 0 }}
        >
          <form
            onSubmit={updateProjectName}
            style={{ padding: "10px 20px" }}
            data-testid="rename-project-form"
          >
            <FormGroup
              labelFor="updated-project-name"
              intent={projectNameError ? "danger" : "none"}
              helperText={projectNameError ? projectNameError : ""}
            >
              <InputGroup
                autoFocus={true}
                type="text"
                required={true}
                data-testid="updated-project-name"
                onChange={e => setUpdatedProjectName(e.target.value)}
                value={updatedProjectName}
              />
            </FormGroup>
            <div className="d-flex justify-center align-center">
              <FormGroup>
                <Button
                  data-testid="rename-project-button"
                  intent="primary"
                  text="Update"
                  type="submit"
                  loading={isRenaming}
                  large={true}
                />
              </FormGroup>
            </div>
          </form>
        </Dialog>
      </React.Fragment>
    );
  }
);

export default ProjectTopbar;
