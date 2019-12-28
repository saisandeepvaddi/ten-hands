import { Tag, Tooltip } from "@blueprintjs/core";
import React from "react";

interface IProjectRunningTasksTagProps {
  count: number;
}

const ProjectRunningTasksTag: React.FC<IProjectRunningTasksTagProps> = ({
  count = 0
}) => {
  return (
    <React.Fragment>
      {count > 0 ? (
        <span>
          <Tooltip content={`${count} ${count > 1 ? "tasks" : "task"} running`}>
            <Tag intent="success" minimal={true}>
              {count}
            </Tag>
          </Tooltip>
        </span>
      ) : null}
    </React.Fragment>
  );
};

export default ProjectRunningTasksTag;
