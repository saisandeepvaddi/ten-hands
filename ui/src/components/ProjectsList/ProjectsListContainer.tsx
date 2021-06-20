import { Button, Icon } from "@blueprintjs/core";
import { captureException } from "@sentry/react";
import React from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import Search from "../Search";
import { reorderProjectsInDb } from "../shared/API";
import { configAtom } from "../shared/state/atoms";
import { useProjects } from "../shared/stores/ProjectStore";
import ProjectItem from "./ProjectItem";
import { Container } from "./styles";

const ListContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 0 10px;
  margin-bottom: 15px;
  &:hover {
    overflow: auto;
  }
`;

const ProjectsListContainer: React.FC = () => {
  const {
    projects: originalProjects,
    setProjects: setOriginalProjects,
    setActiveProject,
    activeProject,
    projectsRunningTaskCount,
  } = useProjects();

  const [projectTaskListOpenMap, setProjectTaskListOpenMap] = React.useState<{
    [K: string]: boolean;
  }>(() => {
    const initProjectTaskListOpenMap = {};
    originalProjects.forEach((project) => {
      initProjectTaskListOpenMap[project._id] = false;
    });

    return initProjectTaskListOpenMap;
  });

  const [searchbarOpen, setSearchbarOpen] = React.useState<boolean>(false);

  /* eslint-disable-next-line */
  const [_, setSelectedItemIndex] = React.useState<number>(0);
  const [projects, setProjects] = React.useState<any>(originalProjects ?? []);
  const [activeProjectIndexBeforeDrag, setActiveProjectIndexBeforeDrag] =
    React.useState<number>(0);

  const config = useRecoilValue(configAtom);

  const expandOrCollapseAllProjects = React.useCallback(
    (collapse = false) => {
      const nextProjectTaskListOpenMap = {};
      originalProjects.forEach((project) => {
        nextProjectTaskListOpenMap[project._id] = collapse;
      });

      setProjectTaskListOpenMap(nextProjectTaskListOpenMap);
    },
    [originalProjects]
  );

  const updateProjectTaskListOpen = React.useCallback(
    (projectId, shouldOpen) => {
      setProjectTaskListOpenMap({
        ...projectTaskListOpenMap,
        [projectId]: shouldOpen,
      });
    },
    [projectTaskListOpenMap]
  );

  const changeActiveProject = React.useCallback(
    (projectId, index: number) => {
      const activeProjectWithId = projects.find(
        (project) => project._id === projectId
      );
      if (activeProjectWithId) {
        setActiveProject(activeProjectWithId);

        setSelectedItemIndex(index);
      } else {
        setActiveProject({
          _id: "",
          name: "",
          type: "",
          path: "",
          commands: [],
        });
      }
    },
    [projects, setActiveProject]
  );

  const updateActiveProjectIndex = () => {
    // Save Index of active project before.
    // So that, we can move animated blue background only if active project changed position.
    const newProjects = [...projects];
    const activeProjectIndex: number =
      newProjects.findIndex((x) => x._id === activeProject._id) || 0;

    setActiveProjectIndexBeforeDrag(activeProjectIndex);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    const newProjects = [...projects];
    const newActiveProjectIndex: number = newProjects.findIndex(
      (x) => x._id === activeProject._id
    );
    if (activeProjectIndexBeforeDrag !== newActiveProjectIndex) {
      setSelectedItemIndex(newActiveProjectIndex);
    }

    updateActiveProjectIndex();
  }, [activeProject, projects]);

  React.useEffect(() => {
    setProjects(originalProjects);
  }, [originalProjects]);

  const saveNewProjectsOrder = React.useCallback(
    (reorderedProjects: IProject[]) => {
      const save = async (projectsWithNewOrder: IProject[]) => {
        try {
          console.info("Saving new projects order");
          const projectIds = projectsWithNewOrder.map((project) => project._id);
          await reorderProjectsInDb(config, projectIds);
          setOriginalProjects(projectsWithNewOrder);
        } catch (error) {
          captureException(error);
          console.log("Error Reordering:", error);
        }
      };
      save(reorderedProjects);
    },
    [projects, config]
  );

  const onDragStart = () => {
    updateActiveProjectIndex();
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newProjects = [...projects];

    const sourceProject = newProjects[source.index];
    newProjects.splice(source.index, 1);
    newProjects.splice(destination.index, 0, sourceProject);

    setProjects(newProjects);
    saveNewProjectsOrder(newProjects);

    // Check if activeProject is moved
    const activeProjectIndexAfterDrag: number = newProjects.findIndex(
      (x) => x._id === activeProject._id
    );
    // console.log("activeProjectIndexBeforeDrag:", activeProjectIndexBeforeDrag);
    // console.log("activeProjectIndexAfterDrag:", activeProjectIndexAfterDrag);
    if (activeProjectIndexBeforeDrag !== activeProjectIndexAfterDrag) {
      setSelectedItemIndex(activeProjectIndexAfterDrag);
    }
  };

  if (!projects || projects.length === 0) {
    return <div />;
  }

  return (
    <React.Fragment>
      <div className="d-flex justify-between" style={{ margin: "5px 0 5px 0" }}>
        <Button
          onClick={() => setSearchbarOpen(true)}
          icon={<Icon icon="search" iconSize={10} />}
          minimal
          small
          title={"Search for any task"}
          style={{
            width: "100%",
            paddingLeft: 20,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <span className="bp3-text-disabled">Search Tasks (Ctrl + F)</span>
        </Button>
        <Button
          onClick={() => expandOrCollapseAllProjects(false)}
          icon={<Icon icon="collapse-all" iconSize={10} />}
          minimal
          small
          title={"Collapse all projects"}
        />
      </div>
      <ListContainer>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable droppableId={"project-list-droppable"}>
            {(droppableProvided: DroppableProvided) => (
              <Container
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
              >
                {/* <TabSwitchAnimator
                  style={{
                    transform: `translateY(${selectedItemIndex * 40}px)`
                  }}
                /> */}
                {projects.map((project: IProject, index: number) => {
                  return (
                    <Draggable
                      draggableId={project._id}
                      index={index}
                      key={project._id}
                    >
                      {(draggableProvided: DraggableProvided) => (
                        <ProjectItem
                          project={project}
                          draggableProvided={draggableProvided}
                          changeActiveProject={changeActiveProject}
                          itemIndex={index}
                          projectRunningTaskCount={
                            projectsRunningTaskCount[project._id]
                          }
                          projectTaskListOpenMap={projectTaskListOpenMap}
                          updateProjectTaskListOpen={updateProjectTaskListOpen}
                        />
                      )}
                    </Draggable>
                  );
                })}
                {droppableProvided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      </ListContainer>
      <Search
        searchbarOpen={searchbarOpen}
        setSearchbarOpen={setSearchbarOpen}
        projects={projects}
        changeActiveProject={changeActiveProject}
      />
    </React.Fragment>
  );
};

export default ProjectsListContainer;
