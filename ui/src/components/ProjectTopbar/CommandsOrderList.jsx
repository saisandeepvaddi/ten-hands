import React from "react";

interface ICommandsOrderListProps {
  activeProject: IProject;
}

const CommandsOrderList: React.FC<ICommandsOrderListProps> = React.memo(
  ({ activeProject }) => {
    return <div />;
  }
);

export default CommandsOrderList;
