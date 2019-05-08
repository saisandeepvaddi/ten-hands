import { Button } from "@blueprintjs/core";
import React from "react";

interface INewProjectCommandsProps {
    commands: IProjectCommand[];
}

const NewProjectCommands: React.FC<INewProjectCommandsProps> = React.memo(({ commands }) => {
    return (
        <div>
            {commands.map((command, key) => {
                if (key === commands.length - 1) {
                    return (
                        <div key={key}>
                            <Button icon="add" intent="success" minimal={true} />
                            <span>{command.name}</span>
                            <span>{command.cmd}</span>
                        </div>
                    );
                }
                return (
                    <div key={key}>
                        <span>{command.name}</span>
                        <span>{command.cmd}</span>
                    </div>
                );
            })}
        </div>
    );
});

export default NewProjectCommands;
