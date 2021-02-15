import { Button, Classes, HTMLTable, Icon } from "@blueprintjs/core";
import React from "react";

interface INewProjectCommandsProps {
  commands: IProjectCommand[];
  setCommands: (commands: IProjectCommand[]) => any;
}

const NewProjectCommands: React.FC<INewProjectCommandsProps> = React.memo(
  ({ commands, setCommands }) => {
    if (commands.length === 0) {
      return <div />;
    }

    const removeCommand = (cmd: IProjectCommand) => {
      const _commands: IProjectCommand[] = [...commands];
      const updatedCommands: IProjectCommand[] = _commands.filter(
        (command) => command._id !== cmd._id
      );
      setCommands(updatedCommands);
    };

    return (
      <div>
        <HTMLTable className={Classes.HTML_TABLE}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Command</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {commands.map((command) => {
              return (
                <tr key={command._id} data-testid="new-project-task-row">
                  <td>{command.name}</td>
                  <td>{command.cmd}</td>
                  <td>
                    <Button
                      intent={"danger"}
                      minimal={true}
                      onClick={() => removeCommand(command)}
                    >
                      <Icon icon="cross" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </HTMLTable>
      </div>
    );
  }
);

export default NewProjectCommands;
