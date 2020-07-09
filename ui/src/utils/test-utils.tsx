import { act, render } from "@testing-library/react";
import React from "react";
import { arrayOf, build, fake, sequence } from "test-data-bot";
import { ConfigProvider } from "../components/shared/stores/ConfigStore";
import { JobsProvider } from "../components/shared/stores/JobStore";
import { ProjectsProvider } from "../components/shared/stores/ProjectStore";
import { SocketsProvider } from "../components/shared/stores/SocketStore";
import { ThemeProvider } from "../components/shared/stores/ThemeStore";

jest.mock("localforage");
jest.mock("../components/shared/API");
jest.mock("socket.io-client", () => {
  const socket: any = {
    on: jest.fn().mockImplementation((event, cb) => {
      // console.log(`mock on with event: ${event}`);
    }),
    emit: jest.fn().mockImplementation((event, data) => {
      // console.log(`mock emit with event: ${event}`);
    }),
  };

  return {
    __esModule: true,
    default: jest.fn((_) => socket),
  };
});

jest.mock("../utils/storage", () => {
  return {
    getItem: jest.fn((key) => {
      switch (key) {
        case "port": {
          return 5010;
        }
        case "state": {
          return null;
        }
        case "theme": {
          // tslint:disable-next-line
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
    }),
  };
});

// jest.mock("../components/shared/API");

export const commandBuilder = build("Command").fields({
  _id: fake((f) => f.random.uuid()),
  name: fake((f) => f.random.word()),
  cmd: fake((f) => f.random.words()),
  execDir: "",
});

export const projectBuilder = build("Project").fields({
  _id: fake((f) => f.random.uuid()),
  name: fake((f) => f.random.word()),
  path: fake((f) => f.fake("D:\\{{random.word}}\\{{random.word}}")),
  commands: arrayOf(commandBuilder, Math.ceil(Math.random() * 5 + 0)),
});

export const packageJsonBuilder = build("PackageJSON").fields({
  name: fake((f) => f.random.word()),
  version: "1.0.0",
  scripts: {
    start: "npm run start",
    test: "yarn test",
  },
});

export const getFakePackageJson = () => {
  const packageJson: any = packageJsonBuilder();
  return packageJson;
};

export const getFakeProjects = (n = 5) => {
  const projects: any = [];

  while (n-- > 0) {
    const newProject = projectBuilder();
    projects.push(newProject);
  }

  return projects;
};

const AllTheProviders = ({ children }) => {
  // const projects = getFakeProjects(5);
  return (
    <ConfigProvider>
      <ThemeProvider>
        <JobsProvider>
          <SocketsProvider>
            <ProjectsProvider>{children}</ProjectsProvider>
          </SocketsProvider>
        </JobsProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

const customRender = async (ui, options?) => {
  try {
    // return render(ui, { wrapper: AllTheProviders, ...options });
    let utils: any = null;
    await act(async () => {
      utils = render(ui, { wrapper: AllTheProviders, ...options });
    });
    return utils;
  } catch (error) {
    console.error("customRender error:", error);
  }
};

export * from "@testing-library/react";

export { customRender as render };
