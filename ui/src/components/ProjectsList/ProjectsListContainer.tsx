import { Classes, Icon } from "@blueprintjs/core";
import Axios from "axios";
import React from "react";
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    DragStart,
    Droppable,
    DroppableProvided,
    DroppableStateSnapshot,
    DropResult,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { useConfig } from "../shared/Config";
import { useProjects } from "../shared/Projects";
import { useTheme } from "../shared/Themes";

const Container = styled.div`
    margin-top: 1em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    position: relative;
`;

const Item = styled.div`
    padding: 0 10px;
    width: 100%;
    display: flex;
    border-radius: 3px;
    user-select: none;
    line-height: 40px;
    font-size: 14px;
    max-width: 100%;
    overflor: hidden;
    justify-content: space-between;
    align-items: center;
    .drag-handle-container {
        display: none;
    }
    &:hover {
        cursor: pointer;
        .drag-handle-container {
            display: block;
        }
        color: ${props => (props.theme === Classes.DARK ? "#48aff0" : "#106ba3")} !important;
    }
`;

const TabSwitchAnimator = styled.div`
    position: absolute;
    transition: height, transform, width, -webkit-transform;
    transition-duration: 0.2s;
    transition-timing-function: cubic-bezier(0.4, 1, 0.75, 0.9);
    height: 40px;
    width: 100%;
    top: 0;
    left: 0;
    background: rgba(19, 124, 189, 0.2);
`;

interface IProjectsListContainerProps {}

const ProjectsListContainer: React.FC<IProjectsListContainerProps> = () => {
    const { projects: tempProjects, setActiveProject, activeProject } = useProjects();
    const { theme } = useTheme();
    const [selectedItemIndex, setSelectedItemIndex] = React.useState<number>(0);
    const [projects, setProjects] = React.useState<any>([]);
    const [activeProjectIndexBeforeDrag, setActiveProjectIndexBeforeDrag] = React.useState<number>(0);
    const { config } = useConfig();

    React.useEffect(() => {
        if (!tempProjects) {
            return;
        }

        setProjects(tempProjects);
    }, [tempProjects]);

    const changeActiveProject = React.useCallback(
        (projectId, index: number) => {
            const activeProjectWithId = projects.find(project => project._id === projectId);
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
        [projects],
    );

    const saveNewProjectsOrder = React.useCallback(
        (projects: IProject[]) => {
            const save = async (projects: IProject[]) => {
                try {
                    console.info("Saving new projects order");
                    const projectIds = projects.map(project => project._id);
                    await Axios.post(`http://localhost:${config.port}/projects/reorder`, {
                        projectIds,
                    });
                    setProjects(projects);
                } catch (error) {
                    console.log("Error Reordering:", error);
                }
            };
            save(projects);
        },
        [projects],
    );

    const onDragStart = (result: DragStart) => {
        // Save Index of active project before.
        // So that, we can move animated blue background only if active project changed position.
        const newProjects = [...projects];
        const activeProjectIndex: number = newProjects.findIndex(x => x._id === activeProject._id);
        if (activeProjectIndex) {
            setActiveProjectIndexBeforeDrag(activeProjectIndex);
        }
    };

    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;
        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const newProjects = [...projects];

        const sourceProject = newProjects[source.index];
        newProjects.splice(source.index, 1);
        newProjects.splice(destination.index, 0, sourceProject);

        setProjects(newProjects);
        saveNewProjectsOrder(newProjects);

        // Check if activeProject is moved
        const activeProjectIndexAfterDrag: number = newProjects.findIndex(x => x._id === activeProject._id);
        console.log("activeProjectIndexBeforeDrag:", activeProjectIndexBeforeDrag);
        console.log("activeProjectIndexAfterDrag:", activeProjectIndexAfterDrag);
        if (activeProjectIndexBeforeDrag !== activeProjectIndexAfterDrag) {
            setSelectedItemIndex(activeProjectIndexAfterDrag);
        }
    };

    if (projects.length === 0) {
        return <div />;
    }

    return (
        <>
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <Droppable droppableId={"project-list-droppable"}>
                    {(provided: DroppableProvided) => (
                        <Container ref={provided.innerRef} {...provided.droppableProps}>
                            <TabSwitchAnimator
                                style={{
                                    transform: `translateY(${selectedItemIndex * 40}px)`,
                                }}
                            />
                            {projects.map((project, index) => (
                                <Draggable draggableId={project._id} index={index} key={project._id}>
                                    {(provided: DraggableProvided) => (
                                        <Item
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            onClick={() => changeActiveProject(project._id, index)}
                                            theme={theme}
                                            style={{
                                                ...provided.draggableProps.style,
                                                color:
                                                    activeProject._id === project._id
                                                        ? theme === Classes.DARK
                                                            ? "#48aff0"
                                                            : "#106ba3"
                                                        : "inherit",
                                            }}
                                        >
                                            {project.name}
                                            <div className="drag-handle-container">
                                                <Icon icon="drag-handle-horizontal" />
                                            </div>
                                        </Item>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Container>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
};

export default ProjectsListContainer;
