import React from "react";
import { render } from "@testing-library/react";
import { ConfigProvider } from "./components/shared/Config";
import { JobsProvider } from "./components/shared/Jobs";
import { ProjectsProvider } from "./components/shared/Projects";
import { ThemeProvider } from "./components/shared/Themes";

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

export const AllTheProviders = ({ children }) => {
  return (
    <ConfigProvider>
      <ThemeProvider>
        <ProjectsProvider value={{ projects, activeProject: projects[0] }}>
          <JobsProvider>{children}</JobsProvider>
        </ProjectsProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

const customRender = (ui, options) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

export * from "@testing-library/react";

export { customRender as render };
