import React from "react";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";
import CommandsOrderListItem from "./CommandOrderListItem";

interface ICommandsOrderListProps {
  commands: IProjectCommand[];
  projectId: string;
}

const CommandsOrderList: React.FC<ICommandsOrderListProps> = React.memo(
  ({ commands, projectId }) => {
    if (commands.length === 0) {
      return <div>No tasks in the project.</div>;
    }

    return (
      <Droppable droppableId={projectId}>
        {(provided: DroppableProvided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {commands.map((command, index) => {
              return (
                <CommandsOrderListItem
                  command={command}
                  key={command._id}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
);

export default CommandsOrderList;
