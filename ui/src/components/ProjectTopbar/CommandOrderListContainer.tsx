import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useProjects } from "../shared/stores/ProjectStore";
import CommandsOrderList from "./CommandsOrderList";

interface ICommandsOrderListContainerProps {
  activeProject: IProject;
}

const CommandOrderListContainer: React.FC<ICommandsOrderListContainerProps> = React.memo(
  ({ activeProject }) => {
    const { reorderTasks } = useProjects();
    const [commands, setCommands] = React.useState(activeProject.commands);

    const saveNewCommandsOrder = (reorderedCommands: IProjectCommand[]) => {
      const save = async (commandsWithNewOrder: IProjectCommand[]) => {
        try {
          console.info("Saving new commands order");
          reorderTasks(activeProject._id, commandsWithNewOrder, "custom");
        } catch (error) {
          console.log("Error Reordering:", error);
        }
      };
      save(reorderedCommands);
    };

    if (commands.length === 0) {
      return <div>No commands in the project.</div>;
    }

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

      const newCommands = [...commands];

      const sourceCommand = newCommands[source.index];
      newCommands.splice(source.index, 1);
      newCommands.splice(destination.index, 0, sourceCommand);

      setCommands(newCommands);
      saveNewCommandsOrder(newCommands);
    };

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <CommandsOrderList commands={commands} projectId={activeProject._id} />
      </DragDropContext>
    );
  }
);

export default CommandOrderListContainer;
