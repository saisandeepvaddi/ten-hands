import React from "react";
import { render } from "@testing-library/react";
import { arrayOf, build, fake, sequence } from "test-data-bot";
import { ConfigProvider } from "../components/shared/Config";
import { JobsProvider } from "../components/shared/Jobs";
import { ProjectsProvider } from "../components/shared/Projects";
import { SocketsProvider } from "../components/shared/Sockets";
import { ThemeProvider } from "../components/shared/Themes";

jest.mock("localforage");

jest.mock("../utils/storage", () => {
  return {
    getItem: jest.fn(key => {
      switch (key) {
        case "port": {
          return 5010;
        }
        case "state": {
          return null;
        }
        case "theme": {
          return "bp3-dark";
        }
        case "enableTerminalTheme": {
          return true;
        }
        default:
          return null;
      }
    }),
    setItem: jest.fn((key, value) => {
      return true;
    })
  };
});

const commandBuilder = build("Command").fields({
  _id: fake(f => f.random.uuid()),
  name: fake(f => f.random.word()),
  cmd: fake(f => f.random.words()),
  execDir: ""
});

const projectBuilder = build("Project").fields({
  _id: fake(f => f.random.uuid()),
  name: fake(f => f.random.word()),
  path: fake(f => f.system.directoryPath()),
  commands: arrayOf(commandBuilder, Math.ceil(Math.random() * 5 + 0))
});

const getFakeProjects = (n = 5) => {
  const projects = [];

  while (n-- > 0) {
    const newProject = projectBuilder();
    projects.push(newProject);
  }

  return projects;
};

const AllTheProviders = ({ children }) => {
  const projects = getFakeProjects(5);
  return (
    <ConfigProvider>
      <ThemeProvider>
        <ProjectsProvider>
          <JobsProvider>
            <SocketsProvider>{children}</SocketsProvider>
          </JobsProvider>
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
