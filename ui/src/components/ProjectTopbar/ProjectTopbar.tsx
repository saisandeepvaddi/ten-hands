import {
  Alert,
  Alignment,
  Button,
  Dialog,
  FormGroup,
  Icon,
  InputGroup,
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
import ProjectMenu from "./ProjectMenu";
import ProjectRenameDialog from "./ProjectRenameDialog";

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
      projectsRunningTaskCount,
      runAllStoppedTasks,
      stopAllRunningTasks
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
    }, [activeProject, isMounted, config]);

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
    }, [activeProject, updateGitBranch]);

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
          <Navbar.Group>
            <Navbar.Divider style={{ paddingRight: 10 }} />{" "}
            <Button
              onClick={() => runAllStoppedTasks()}
              icon="play"
              intent="success"
              text="Run All"
              minimal={true}
              data-testid="run-all-stopped-tasks"
              title={
                projectsRunningTaskCount[activeProject._id!] ===
                activeProject.commands.length
                  ? "All the tasks in the project are already running."
                  : "Runs all stopped tasks in this project."
              }
              disabled={
                projectsRunningTaskCount[activeProject._id!] ===
                activeProject.commands.length
              }
            />
            <Button
              onClick={() => stopAllRunningTasks()}
              icon="stop"
              intent="danger"
              text="Stop All"
              minimal={true}
              data-testid="stop-all-running-tasks"
              title={
                projectsRunningTaskCount[activeProject._id!] === 0
                  ? "No tasks are running in the project."
                  : "Stops all running tasks in this project."
              }
              disabled={projectsRunningTaskCount[activeProject._id!] === 0}
            />
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
              <ProjectMenu
                setRenameProjectModalOpen={setRenameProjectModalOpen}
                setCommandsOrderModalOpen={setCommandsOrderModalOpen}
                setDeleteAlertOpen={setDeleteAlertOpen}
                activeProject={activeProject}
                projectsRunningTaskCount={projectsRunningTaskCount}
              />
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
        <ProjectRenameDialog
          activeProject={activeProject}
          theme={theme}
          renameProjectModalOpen={renameProjectModalOpen}
          handleRenameProjectModalClose={handleRenameProjectModalClose}
          updateProjectName={updateProjectName}
          projectNameError={projectNameError}
          setUpdatedProjectName={setUpdatedProjectName}
          updatedProjectName={updatedProjectName}
          isRenaming={isRenaming}
        />
      </React.Fragment>
    );
  }
);

export default ProjectTopbar;
