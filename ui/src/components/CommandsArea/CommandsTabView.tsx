import React from "react";
import { Tabs, Tab } from "@blueprintjs/core";
import Command from "../Command/Command";

interface ICommandsTabViewProps {
  commands: IProjectCommand[];
  activeProject: IProject;
}

const CommandsTabView: React.FC<ICommandsTabViewProps> = ({
  commands,
  activeProject
}) => {
  const [selectedTaskId, setSelectedTaskId] = React.useState<string>(
    commands[0].id
  );

  const handleTabChange = tabId => {
    setSelectedTaskId(tabId);
  };

  return (
    <React.Fragment>
      <div style={{ margin: 20 }}>
        <Tabs
          id="TabsExample"
          onChange={handleTabChange}
          selectedTabId={selectedTaskId}
        >
          {commands.map((command, index) => {
            return (
              <Tab
                key={command._id}
                id={command._id}
                title={command.name}
                panel={
                  <Command
                    index={index}
                    projectPath={activeProject.path}
                    command={command}
                  />
                }
              ></Tab>
            );
          })}
        </Tabs>
      </div>
    </React.Fragment>
  );
};

export default CommandsTabView;
