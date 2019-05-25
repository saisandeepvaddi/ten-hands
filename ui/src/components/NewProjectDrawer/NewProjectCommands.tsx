import { Classes, HTMLTable } from "@blueprintjs/core";
import React from "react";

interface INewProjectCommandsProps {
    commands: IProjectCommand[];
}

const NewProjectCommands: React.FC<INewProjectCommandsProps> = React.memo(({ commands }) => {
    if (commands.length === 0) {
        return <div />;
    }
    return (
        <div>
            <HTMLTable className={Classes.HTML_TABLE}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Command</th>
                    </tr>
                </thead>
                <tbody>
                    {commands.map((command, key) => {
                        return (
                            <tr key={command._id}>
                                <td>{command.name}</td>
                                <td>{command.cmd}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </HTMLTable>
        </div>
    );
});

export default NewProjectCommands;
