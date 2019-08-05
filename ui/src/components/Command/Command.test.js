import React from "react";
import { render, fireEvent, waitForElement } from "../../test-utils";
import Command from "./Command";
import { ProjectsProvider, ProjectContext } from "../shared/Projects";
import { JobsProvider, JobsContext } from "../shared/Jobs";
import JobSocket from "../../utils/socket";

describe("Command Component", () => {
  const props = {
    command: {
      _id: "11",
      name: "demo-cmd",
      cmd: "demo command",
      execDir: ""
    },
    socket: JobSocket.getInstance(),
    projectPath: "D:\\Test"
  };

  test("Render Component", async () => {
    const { container } = render(<Command {...props} />);
    expect(container).not.toBeNull();
  });

  test("Shows command name", async () => {
    const { getByTestId } = render(<Command {...props} />);
    expect(getByTestId("command-name")).toHaveTextContent(props.command.name);
  });

  test("Shows command", async () => {
    const { getByTestId } = render(<Command {...props} />);
    expect(getByTestId("command-cmd")).toHaveTextContent(props.command.cmd);
  });
});
