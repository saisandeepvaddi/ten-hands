import React from "react";
import { render, fireEvent } from "../../test-utils";
import ProjectsList from "./ProjectsList";
import { ProjectsProvider, ProjectContext } from "../shared/Projects";
import { ThemeProvider } from "../shared/Themes";
import { ConfigProvider } from "../shared/Config";
import { JobsProvider } from "../shared/Jobs";

test("renders without crashing", () => {
  const { container } = render(<ProjectsList />);
  expect(container).not.toBeNull();
});

function setupTestProjectsList() {
  const projects = [
    {
      _id: "1",
      name: "demo-project-1",
      commands: [
        {
          _id: "11",
          name: "demo-cmd",
          cmd: "demo command"
        }
      ]
    },
    {
      _id: "2",
      name: "demo-project-2",
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
      value={{ projects, activeProject: projects[0] }}
      {...props}
    />
  );

  const testComponent = render(
    <TestProjectsProvider>
      <ProjectsList />
    </TestProjectsProvider>
  );

  return testComponent;
}

test("Should have project", async () => {
  const { getByText } = setupTestProjectsList();

  expect(getByText(/demo-project-1/i)).not.toBeNull();
});
