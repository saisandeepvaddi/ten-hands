import React from "react";
import Command from "../Command/Command";
import { Card, Elevation } from "@blueprintjs/core";

interface ICommandsRowViewProps {
  commands: IProjectCommand[];
  activeProject: IProject;
}

const CommandsRowView: React.FC<ICommandsRowViewProps> = ({
  commands,
  activeProject,
}) => {
  return (
    <React.Fragment>
      {commands.map((command, index) => {
        return (
          // Use id for card to use to scroll when clicked on task in sidebar
          <Card
            id={`task-card-${command._id}`}
            key={command._id}
            elevation={Elevation.ONE}
            style={{ margin: 20, padding: "15px 15px 10px 15px" }}
          >
            <Command
              index={index}
              projectPath={activeProject.path}
              projectId={activeProject._id}
              command={command}
            />
          </Card>
        );
      })}
    </React.Fragment>
  );
};

export default CommandsRowView;
