import React from "react";
import { Omnibar } from "@blueprintjs/select";
import { areCommandsEqual, getCommandSelectProps } from "./task-search";
import { MenuItem } from "@blueprintjs/core";
import { wait } from "../shared/utilities";

interface ISearchProps {
  searchbarOpen: boolean;
  setSearchbarOpen: (boolean) => any;
  projects: IProject[];
  changeActiveProject: (projectId: string, projectIndex: number) => void;
}

const ProjectOmnibar = Omnibar.ofType<ISearchProjectCommand>();

const Search: React.FC<ISearchProps> = ({
  searchbarOpen,
  setSearchbarOpen,
  projects,
  changeActiveProject,
}) => {
  const onItemSelect = async (command: ISearchProjectCommand) => {
    changeActiveProject(command.projectId, command.projectIndex);
    await wait(200);
    const taskCard = document.getElementById(`task-card-${command._id}`);
    if (taskCard) {
      taskCard.scrollIntoView({
        behavior: "smooth",
      });
    }
    setSearchbarOpen(false);
  };

  const allCommands: ISearchProjectCommand[] = projects
    .map((project, i) => {
      const _commands: ISearchProjectCommand[] = project.commands.map(
        (command) => {
          return {
            ...command,
            projectId: project._id,
            projectIndex: i,
            projectName: project.name,
          };
        }
      );

      return _commands;
    })
    .flat();

  return (
    <React.Fragment>
      <ProjectOmnibar
        className="search-omnibar-container"
        overlayProps={{ className: "search-omnibar" }}
        {...getCommandSelectProps(allCommands)}
        isOpen={searchbarOpen}
        resetOnSelect={true}
        itemsEqual={areCommandsEqual}
        noResults={<MenuItem disabled text="No results." />}
        onItemSelect={onItemSelect}
        onClose={() => setSearchbarOpen(false)}
      />
    </React.Fragment>
  );
};

export default Search;
