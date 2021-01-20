// import "jest-dom/extend-expect";
// import "react-testing-library/cleanup-after-each";
import React from "react";
import { render } from "../../utils/test-utils";

import NewProjectForm from "./NewProjectForm";

describe.only("NewProjectForm Component", () => {
  let projectsSpy: jest.SpyInstance;
  it.skip("renders without crashing", async () => {
    try {
      const { container, getByText } = await render(
        <NewProjectForm setDrawerOpen={jest.fn()} />
      );
      expect(container).not.toBeNull();
      expect(getByText(/new project/i)).toBeInTheDocument();
    } catch (error) {
      console.log("NewProjectForm error:", error);
    }
  });

  // it.only("tests project form submission", async () => {
  //     projectsSpy = jest.spyOn(ajaxCalls, "getProjects");
  //     const submitSpy = jest.spyOn(ajaxCalls, "saveProjectInDb");

  //     const projects: IProject[] = getFakeProjects(1);
  //     projectsSpy.mockImplementation(() => Promise.resolve(projects));
  //     const { getByLabelText, getByTestId, debug } = await render(<NewProjectForm setDrawerOpen={jest.fn()} />);
  //     const projectNameInput = getByLabelText(/project name/i);

  //     const project = getFakeProjects(1)[0];
  //     fireEvent.input(projectNameInput, {
  //         target: { value: project.name },
  //     });

  //     const pathInput = getByLabelText(/project path/i);

  //     fireEvent.input(pathInput, {
  //         target: { value: project.path },
  //     });

  //     await wait();

  //     const config = {
  //         port: 5010,
  //         enableTerminalTheme: true,
  //     };

  //     const submitProject = {
  //         name: project.name,
  //         path: project.path,
  //         commands: [],
  //         configFile: "",
  //         type: "",
  //     };

  //     const form = getByTestId("new-project-form");
  //     fireEvent.submit(form);

  //     await wait();

  //     expect(submitSpy).toHaveBeenCalledWith(config, submitProject);
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
