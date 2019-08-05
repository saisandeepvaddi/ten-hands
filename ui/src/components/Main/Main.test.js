import React from "react";
import { render, fireEvent } from "../../test-utils";
import Main from "./Main";
import { ProjectsProvider, ProjectContext } from "../shared/Projects";
import { ThemeProvider } from "../shared/Themes";
import { ConfigProvider } from "../shared/Config";
import { JobsProvider } from "../shared/Jobs";
import { wait } from "@testing-library/react";

test("renders without crashing", () => {
  const { container } = render(<Main />);
  expect(container).not.toBeNull();
});

function setupMain(options = {}) {
  const projects = [
    {
      _id: "1",
      name: "demo-project-1",
      path: "D:\\Test",
      commands: [
        {
          _id: "11",
          name: "demo-cmd",
          cmd: "demo command",
          execDir: ""
        }
      ]
    },
    {
      _id: "2",
      name: "demo-project-2",
      path: "D:\\Test",
      commands: [
        {
          _id: "21",
          name: "demo-cmd-21",
          cmd: "demo command"
        }
      ]
    }
  ];

  const TestProjectsProvider = props => (
    <ProjectContext.Provider
      value={{ projects, activeProject: projects[0], ...options }}
      {...props}
    />
  );

  const testComponent = render(
    <TestProjectsProvider>
      <Main />
    </TestProjectsProvider>
  );

  return testComponent;
}

test("Shows spinner if loading", async () => {
  const { container, debug } = render(<Main />);
  expect(container.querySelectorAll(".bp3-spinner")).toHaveLength(1);
});

// test("Should have selected project", async () => {
//   const { debug, findByText } = setupMain({ loadingProjects: false });
//   debug();
//   expect(await findByText(/demo-project-1/i)).not.toBeNull();
// });
