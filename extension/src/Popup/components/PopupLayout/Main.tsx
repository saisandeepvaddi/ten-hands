import React from "react";
import { useRecoilValue } from "recoil";
import { activeProjectAtom } from "../../stores/projects.atom";

const Main = () => {
  const activeProject = useRecoilValue(activeProjectAtom);
  if (!activeProject) {
    return null;
  }
  return (
    <React.Fragment>
      <h2>{activeProject.name}</h2>
      <div>
        {activeProject.commands.map((command) => (
          <div key={command._id}>{command.name}</div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default Main;
