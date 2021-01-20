import {
  Alert,
  Alignment,
  Button,
  Dialog,
  Icon,
  Navbar,
  Popover,
  Tooltip,
} from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import { isRunningInElectron, openInExplorer } from "../../utils/electron";
import NewCommandDrawer from "../NewCommandDrawer";
import { getGitRepo } from "../shared/API";
import { useConfig } from "../shared/stores/ConfigStore";
import { useProjects } from "../shared/stores/ProjectStore";
import { useTheme } from "../shared/stores/ThemeStore";
import CommandOrderListContainer from "./CommandOrderListContainer";
import ProjectMenu from "./ProjectMenu";
import Sorter from "./Sorter";
import EditProjectDrawer from "../ProjectForm/EditProjectDrawer";
import { useQuery } from "react-query";

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

    const [
      commandsOrderModalOpen,
      setCommandsOrderModalOpen,
    ] = React.useState<boolean>(false);
    const { theme } = useTheme();
    const [isDrawerOpen, setDrawerOpen] = React.useState<boolean>(false);
    const [
      isProjectDrawerOpen,
      setIsProjectDrawerOpen,
    ] = React.useState<boolean>(false);

    const { config } = useConfig();

    const gitInfo = useQuery(["gitBranch", config, activeProject], () =>
      getGitRepo(config, activeProject.path)
    );

    const {
      deleteProject,
      projectsRunningTaskCount,
      runAllStoppedTasks,
      stopAllRunningTasks,
      reorderTasks,
    } = useProjects();

    const shouldDeleteProject = async (shouldDelete) => {
      try {
        if (shouldDelete) {
          deleteProject(activeProject._id);
          setDeleteAlertOpen(false);
        }
      } catch (error) {
        console.error(`Error deleting project: `, error);
      }
    };

    const handleChangeOrderModalClose = () => {
      setCommandsOrderModalOpen(false);
    };

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
              {gitInfo?.isLoading ? (
                "loading..."
              ) : gitInfo?.data?.branch ? (
                <GitBranchContainer>
                  <Navbar.Divider style={{ paddingRight: 10 }} />{" "}
                  <Icon icon="git-branch" />
                  {
                    <span className="git-branch-name">
                      {gitInfo?.data?.branch}
                    </span>
                  }
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
                projectsRunningTaskCount[activeProject._id] ===
                activeProject.commands.length
                  ? "All the tasks in the project are already running."
                  : "Runs all stopped tasks in this project."
              }
              disabled={
                projectsRunningTaskCount[activeProject._id] ===
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
                projectsRunningTaskCount[activeProject._id] === 0
                  ? "No tasks are running in the project."
                  : "Stops all running tasks in this project."
              }
              disabled={projectsRunningTaskCount[activeProject._id] === 0}
            />
          </Navbar.Group>
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Divider style={{ paddingRight: 10 }} />
            <Sorter activeProject={activeProject} reorderTasks={reorderTasks} />
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
                setIsProjectDrawerOpen={setIsProjectDrawerOpen}
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
        <EditProjectDrawer
          activeProject={activeProject}
          isDrawerOpen={isProjectDrawerOpen}
          setDrawerOpen={setIsProjectDrawerOpen}
        />
      </React.Fragment>
    );
  }
);

export default ProjectTopbar;
