import React from "react";
import { render, fireEvent } from "../../test-utils";
import Sidebar from "./Sidebar";
import { findByText } from "@testing-library/dom";

import { ProjectsProvider, ProjectContext } from "../shared/Projects";
import { ThemeProvider } from "../shared/Themes";
import { ConfigProvider } from "../shared/Config";
import { JobsProvider } from "../shared/Jobs";

test("renders without crashing", () => {
  const { container } = render(<Sidebar />);
  expect(container).not.toBeNull();
});

test("add new button opens new project drawer", async () => {
  const { getByText } = render(<Sidebar />);

  const container = document.querySelector("body");
  const button = getByText(/New Project/i);

  fireEvent.click(button);

  const sidebar = await findByText(container, /add project/i);
  expect(sidebar).toBeTruthy();
});

function setupTestProjectsList() {
  const projects = [
    {
      _id: "1",
      name: "test-project",
      commands: [
        {
          _id: "2",
          name: "test-cmd",
          cmd: "test command"
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
      <Sidebar />
    </TestProjectsProvider>
  );

  return testComponent;
}

test("Should have some projects", async () => {
  const { container, debug, getByText } = setupTestProjectsList();

  expect(getByText(/test-project/)).not.toBeNull();
});
