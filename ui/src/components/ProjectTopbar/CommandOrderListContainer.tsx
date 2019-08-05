import Axios from "axios";
import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useConfig } from "../shared/Config";
import { useProjects } from "../shared/Projects";
import CommandsOrderList from "./CommandsOrderList";

interface ICommandsOrderListContainerProps {
    activeProject: IProject;
}

const CommandOrderListContainer: React.FC<ICommandsOrderListContainerProps> = React.memo(({ activeProject }) => {
    const { config } = useConfig();
    const { updateProjects } = useProjects();
    const [commands, setCommands] = React.useState(activeProject.commands);

    const saveNewCommandsOrder = React.useCallback(
        (commands: IProjectCommand[]) => {
            const save = async (commands: IProjectCommand[]) => {
                try {
                    console.info("Saving new commands order");
                    await Axios.post(`http://localhost:${config.port}/projects/${activeProject._id}/commands/reorder`, {
                        commands,
                    });
                } catch (error) {
                    console.log("Error Reordering:", error);
                }
            };
            save(commands);
        },
        [commands],
    );

    if (commands.length === 0) {
        return <div>No commands in the project.</div>;
    }

    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;
        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const newCommands = [...commands];

        const sourceCommand = newCommands[source.index];
        newCommands.splice(source.index, 1);
        newCommands.splice(destination.index, 0, sourceCommand);

        setCommands(newCommands);
        saveNewCommandsOrder(newCommands);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <CommandsOrderList commands={commands} projectId={activeProject._id!} />
        </DragDropContext>
    );
});

export default CommandOrderListContainer;
