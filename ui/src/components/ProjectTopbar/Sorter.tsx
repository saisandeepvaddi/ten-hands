import React from "react";
import { HTMLSelect, Button, Icon, Dialog } from "@blueprintjs/core";
import { getYesterday } from "../../utils/general";
import { useTheme } from "../shared/stores/ThemeStore";
import CommandOrderListContainer from "./CommandOrderListContainer";

interface ISorterProps {
  reorderTasks: (
    projectId: string,
    newTasks: IProjectCommand[],
    taskSortOrder?: TASK_SORT_ORDER
  ) => any;
  activeProject: IProject;
}

const Sorter: React.FC<ISorterProps> = React.memo(
  ({ reorderTasks, activeProject }) => {
    const [tasksOrder, setTasksOrder] = React.useState<TASK_SORT_ORDER>(
      activeProject.taskSortOrder ?? "name-asc"
    );

    const { theme } = useTheme();

    const [commandsOrderModalOpen, setCommandsOrderModalOpen] = React.useState<
      boolean
    >(false);

    const sortTasksBy = (order: TASK_SORT_ORDER = "name-asc") => {
      let tasksToSort: IProjectCommand[] = [...activeProject.commands].map(
        (command) => {
          const { lastExecutedAt } = command;
          if (!lastExecutedAt) {
            return {
              ...command,
              lastExecutedAt: getYesterday(),
            };
          }
          return command;
        }
      );

      if (order === "name-asc") {
        tasksToSort.sort((a, b) =>
          a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
        );
      } else if (order === "name-desc") {
        tasksToSort.sort((a, b) =>
          a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
        );
      } else if (order === "last-executed") {
        tasksToSort.sort((a, b) =>
          new Date(a.lastExecutedAt).getTime() <
          new Date(b.lastExecutedAt).getTime()
            ? 1
            : -1
        );
      }
      reorderTasks(activeProject._id!, tasksToSort, tasksOrder);
    };
    const handleChangeOrderModalClose = () => {
      setCommandsOrderModalOpen(false);
    };
    React.useEffect(() => {
      console.log("tasksOrder:", tasksOrder);
      if (tasksOrder === "custom") {
        return;
      }
      sortTasksBy(tasksOrder);
    }, [tasksOrder]);

    React.useEffect(() => {
      console.log("Active Project Changed...");
      console.log("activeProject, tasksOrder:", activeProject, tasksOrder);

      if (activeProject.taskSortOrder !== tasksOrder) {
        if (!activeProject.taskSortOrder) {
          setTasksOrder("name-asc");
        } else {
          setTasksOrder(activeProject.taskSortOrder);
        }
      }
    }, [activeProject]);

    return (
      <React.Fragment>
        Sort tasks by: <span style={{ paddingRight: 10 }}></span>
        <HTMLSelect
          value={tasksOrder}
          onChange={(e) => {
            const order = e.target.value as TASK_SORT_ORDER;
            setTasksOrder(order);
            if (order === "custom") {
              setCommandsOrderModalOpen(true);
            }
          }}
          options={[
            { label: "Name (A-Z)", value: "name-asc" },
            { label: "Name (Z-A)", value: "name-desc" },
            { label: "Last Executed", value: "last-executed" },
            { label: "Custom", value: "custom" },
          ]}
        />
        <Button
          icon={<Icon icon="refresh" iconSize={12} />}
          intent="none"
          minimal
          data-testid="refresh-task-sort-order"
          small
          style={{ padding: 5, marginLeft: 2 }}
          title="Click to refresh task sort order."
          onClick={() => {
            sortTasksBy(tasksOrder);
            if (tasksOrder === "custom") {
              setCommandsOrderModalOpen(true);
            }
          }}
        />
        <Dialog
          title="Drag to set custom task order"
          icon={"numbered-list"}
          className={theme}
          isOpen={commandsOrderModalOpen}
          onClose={handleChangeOrderModalClose}
        >
          <CommandOrderListContainer activeProject={activeProject} />
        </Dialog>
      </React.Fragment>
    );
  }
);

export default Sorter;
