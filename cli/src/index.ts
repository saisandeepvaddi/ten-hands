#!/usr/bin/env node
import { startQuestions } from "./cli";
import path from "path";
import chalk from "chalk";
import { startServer } from "./server";
import Axios, { AxiosResponse } from "axios";

const saveProject = async (project: IProject) => {
  try {
    const responseData: AxiosResponse = await Axios({
      timeout: 2000,
      method: "post",
      baseURL: `http://localhost:5010`,
      url: "projects",
      data: project
    });

    if (responseData.status === 200) {
      console.log(
        chalk.green(
          `Added command ${
            project.name
          } to Ten-Hands. Open the desktop app or web app to execute command. Refresh app if already opened.`
        )
      );
    }
  } catch (error) {
    throw new Error(error);
  }
};

const createProject = answers => {
  const { name, type, projectPath, cmds } = answers;
  let project: IProject = {
    name: "",
    type: "",
    path: "",
    configFile: "",
    commands: []
  };
  if (!name) {
    throw new Error("Invalid Command/Project Name");
  }

  project.name = name;

  project.type = type;

  if (projectPath === "") {
    project.path = path.normalize(process.cwd());
  } else {
    project.path = path.normalize(projectPath);
  }

  if (!cmds || cmds.length < 1) {
    throw new Error("Invalid Command. You might have missed entering command.");
  }

  const commands: IProjectCommand[] = cmds.map(command => {
    return {
      name: command.name,
      cmd: command.cmd,
      execDir: ""
    };
  });

  project.commands = commands.slice();

  return project;
};

const startTenHands = async () => {
  try {
    const args = process.argv;
    const isServerRelated = args[2] === "server";
    if (isServerRelated) {
      await startServer();
    } else {
      const answers = await startQuestions();
      const project: IProject = createProject(answers);
      // console.log("project:", project);
      await saveProject(project);
    }
  } catch (error) {
    console.log(chalk.redBright(error.message));
  }
};

startTenHands();
