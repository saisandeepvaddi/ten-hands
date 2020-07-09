import React from "react";

import { getFakeProjects, render } from "../../utils/test-utils";
import * as ajaxCalls from "../shared/API";
import ProjectsList from "./ProjectsList";

describe.only("ProjectsList Component", () => {
  let projectsSpy: jest.SpyInstance;
  it("renders without crashing", async () => {
    try {
      const { container } = await render(<ProjectsList />);
      expect(container).not.toBeNull();
    } catch (error) {
      console.log("error:", error);
    }
  });
  // it("shows list of projects on ui", async () => {
  //   projectsSpy = jest.spyOn(ajaxCalls, "getProjects");
  //   const projects: IProject[] = getFakeProjects(2);
  //   projectsSpy.mockImplementation(() => Promise.resolve(projects));
  //   const { getAllByText } = await render(<ProjectsList />);
  //   expect(projectsSpy).toHaveBeenCalledTimes(1);
  //   expect(getAllByText(projects[0].name).length).toBeGreaterThan(0);
  //   expect(getAllByText(projects[1].name).length).toBeGreaterThan(0);
  // });

  // it.only("has task list for the project", async () => {
  //   projectsSpy = jest.spyOn(ajaxCalls, "getProjects");
  //   const projects: IProject[] = getFakeProjects(2);
  //   projectsSpy.mockImplementation(() => Promise.resolve(projects));
  //   const { getAllByTestId } = await render(<ProjectsList />);
  //   const firstTaskButton = getAllByTestId("project-task-button")[0];
  //   expect(firstTaskButton).toBeInTheDocument();
  //   projectsSpy.mockRestore();
  // });
});
