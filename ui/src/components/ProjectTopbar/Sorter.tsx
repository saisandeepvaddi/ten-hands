import React from "react";
import { HTMLSelect, Button, Icon } from "@blueprintjs/core";
import { useProjects } from "../shared/stores/ProjectStore";
import { getYesterday } from "../../utils/general";

interface ISorterProps {
  reorderTasks: (projectId: string, newTasks: IProjectCommand[]) => any;
  activeProject: IProject;
}

const Sorter: React.FC<ISorterProps> = ({ reorderTasks, activeProject }) => {
  const [tasksOrder, setTasksOrder] = React.useState<TASK_SORT_ORDER>("name");

  const sortTasksBy = (order: TASK_SORT_ORDER = "name") => {
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

    if (order === "name") {
      tasksToSort.sort((a, b) => (a.name < b.name ? -1 : 1));
    } else if (order === "last-executed") {
      tasksToSort.sort((a, b) =>
        new Date(a.lastExecutedAt).getTime() <
        new Date(b.lastExecutedAt).getTime()
          ? 1
          : -1
      );
    }
    reorderTasks(activeProject._id!, tasksToSort);
  };

  React.useEffect(() => {
    sortTasksBy(tasksOrder);
  }, [tasksOrder]);

  return (
    <React.Fragment>
      Sort tasks by: <span style={{ paddingRight: 10 }}></span>
      <HTMLSelect
        value={tasksOrder}
        onChange={(e) => {
          const order = e.target.value as TASK_SORT_ORDER;
          setTasksOrder(order);
        }}
        options={[
          { label: "Name", value: "name" },
          { label: "Last Executed", value: "last-executed" },
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
        onClick={() => sortTasksBy(tasksOrder)}
      />
    </React.Fragment>
  );
};

export default Sorter;
