import React from "react";
import { Item } from "./styles";
import { DraggableProvided } from "react-beautiful-dnd";
import { useTheme } from "../shared/stores/ThemeStore";
import { useProjects } from "../shared/stores/ProjectStore";
import ProjectRunningTasksTag from "./ProjectRunningTasksTag";
import { Classes, Icon, Collapse, Button, Alignment } from "@blueprintjs/core";

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
  const [isTaskListOpen, setIsTaskListOpen] = React.useState<boolean>(false);
  const [showDragHandle, setShowDragHandle] = React.useState<boolean>(false);

  const scrollToTask = task => {
    const taskCard = document.getElementById(task._id);
    if (taskCard) {
      taskCard.scrollIntoView({
        behavior: "smooth"
      });
    }
  };

  const handleMouseOver = e => {
    setShowDragHandle(true);
  };

  const handleMouseOut = e => {
    setShowDragHandle(false);
  };

  return (
    <React.Fragment>
      <Item
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOut}
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
        <Icon
          icon={isTaskListOpen ? "chevron-down" : "chevron-right"}
          style={{ paddingRight: 10 }}
          onClick={() => setIsTaskListOpen(!isTaskListOpen)}
        />
        <span data-testid="project-name" className="truncate">
          {project.name}
        </span>
        {showDragHandle ? (
          <div className="drag-handle-container" style={{ marginLeft: "auto" }}>
            <Icon icon="drag-handle-horizontal" />
          </div>
        ) : (
          <div className="running-tasks-count" style={{ marginLeft: "auto" }}>
            <ProjectRunningTasksTag
              count={projectRunningTaskCount[project._id!]}
            />
          </div>
        )}
      </Item>
      <div className="w-100">
        <Collapse isOpen={isTaskListOpen} keepChildrenMounted={true}>
          <div style={{ paddingLeft: 20 }}>
            {project.commands.map(command => (
              <Button
                key={command._id}
                fill
                title={command.cmd}
                style={{ padding: 5 }}
                minimal
                onClick={() => scrollToTask(command)}
                alignText={Alignment.LEFT}
                icon={"dot"}
              >
                {command.name}
              </Button>
            ))}
          </div>
        </Collapse>
      </div>
    </React.Fragment>
  );
};

export default ProjectItem;
