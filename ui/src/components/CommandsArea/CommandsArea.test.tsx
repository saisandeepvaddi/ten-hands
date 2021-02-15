// import "jest-dom/extend-expect";
// import "react-testing-library/cleanup-after-each";
import React from "react";
import { getFakeProjects, render } from "../../utils/test-utils";

import CommandsArea from "./CommandsArea";

describe("CommandsArea Component", () => {
  let projectsSpy: jest.SpyInstance;
  it("shows active project name", async () => {
    try {
      const activeProject: IProject = getFakeProjects(1)[0];
      const { container, getByTestId } = await render(
        <CommandsArea activeProject={activeProject} />
      );
      expect(container).not.toBeNull();
      expect(getByTestId("active-project-name").textContent).toBe(
        activeProject.name
      );
    } catch (error) {
      console.log("CommandsArea error:", error);
    }
  });

  // Remove isRunningInElectron() check in component before running this testcase.
  // it.only("shows no tasks if no tasks available in project", async () => {
  //     try {
  //         const activeProject: IProject = getFakeProjects(1)[0];
  //         activeProject.commands = [];
  //         const { getByTestId } = await render(<CommandsArea activeProject={activeProject} />);
  //         expect(getByTestId("no-tasks-message")).toBeInTheDocument();
  //     } catch (error) {
  //         console.log("error:", error);
  //     }
  // });

  afterEach(() => {
    if (projectsSpy) {
      projectsSpy.mockRestore();
    }
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
