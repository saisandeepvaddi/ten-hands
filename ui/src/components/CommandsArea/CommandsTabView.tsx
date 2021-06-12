import { Card, Elevation, Tab, Tabs } from "@blueprintjs/core";
import React from "react";

import Command from "../Command/Command";

interface ICommandsTabViewProps {
  commands: IProjectCommand[];
  activeProject: IProject;
}

const CommandsTabView: React.FC<ICommandsTabViewProps> = ({
  commands,
  activeProject,
}) => {
  const [selectedTaskId, setSelectedTaskId] = React.useState<string>(
    commands[0].id
  );

  const handleTabChange = (tabId) => {
    setSelectedTaskId(tabId);
  };

  return (
    <React.Fragment>
      <div style={{ margin: 20 }}>
        <Tabs
          id="TabsExample"
          onChange={handleTabChange}
          selectedTabId={selectedTaskId}
          renderActiveTabPanelOnly
        >
          {commands.map((command, index) => {
            return (
              <Tab
                key={command._id}
                id={command._id}
                title={command.name}
                panel={
                  <Card
                    id={`task-card-${command._id}`}
                    key={command._id}
                    elevation={Elevation.ONE}
                    style={{ padding: 15 }}
                  >
                    <Command
                      index={index}
                      projectPath={activeProject.path}
                      command={command}
                      projectId={activeProject._id}
                    />
                  </Card>
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
