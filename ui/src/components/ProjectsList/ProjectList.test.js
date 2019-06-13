import React from "react";
import { render, fireEvent } from "../../test-utils";
import ProjectsList from "./ProjectsList";
import { findByText } from "@testing-library/dom";

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
      name: "demo-project",
      commands: [
        {
          _id: "2",
          name: "demo-cmd",
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

test("Should have some projects", async () => {
  const { getByText } = setupTestProjectsList();

  expect(getByText(/demo-project/)).not.toBeNull();
});
