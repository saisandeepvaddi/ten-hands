import React from "react";
import { Item } from "./styles";
import { DraggableProvided } from "react-beautiful-dnd";
import { useTheme } from "../shared/stores/ThemeStore";
import { useProjects } from "../shared/stores/ProjectStore";
import ProjectRunningTasksTag from "./ProjectRunningTasksTag";
import { Classes, Icon } from "@blueprintjs/core";

interface IProjectItemProps {
  project: IProject;
  draggableProvided: DraggableProvided;
  changeActiveProject: (projectId: string, index: number) => any;
  itemIndex: number;
  projectRunningTaskCount: any;
}

const ProjectItem: React.FC<IProjectItemProps> = ({
  project,
  draggableProvided,
  changeActiveProject,
  itemIndex,
  projectRunningTaskCount
}) => {
  const { theme } = useTheme();
  const { activeProject } = useProjects();

  return (
    <Item
      ref={draggableProvided.innerRef}
      {...draggableProvided.draggableProps}
      {...draggableProvided.dragHandleProps}
      onClick={() => changeActiveProject(project._id!, itemIndex)}
      theme={theme}
      style={{
        ...draggableProvided.draggableProps.style,
        color:
          activeProject._id === project._id
            ? theme === Classes.DARK
              ? "#48aff0"
              : "#106ba3"
            : "inherit"
      }}
      title={project.path}
    >
      <span data-testid="project-name" className="truncate">
        {project.name}
      </span>
      <div className="running-tasks-count" style={{ marginLeft: "auto" }}>
        <ProjectRunningTasksTag count={projectRunningTaskCount[project._id!]} />
      </div>
      <div className="drag-handle-container">
        <Icon icon="drag-handle-horizontal" />
      </div>
    </Item>
  );
};

export default ProjectItem;
