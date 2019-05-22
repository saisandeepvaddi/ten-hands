#!/usr/bin/env node
import { startQuestions } from "./cli";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import chalk from "chalk";
import fetch from "node-fetch";
import { startServer } from "./server";

const saveProject = async (project: IProject) => {
  try {
    const response = await fetch("http://localhost:1010/projects", {
      method: "post",
      body: JSON.stringify({ ...project }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log(
      chalk.green(
        `Added command ${
          project.name
        } to Ten-Hands. Open the desktop app or web app to execute command. Refresh app if already opened.`
      )
    );
  } catch (error) {
    throw new Error(error);
  }
};

const createProject = answers => {
  console.log("answers:", answers);
  const { name, type, projectPath, cmd } = answers;
  let project: IProject = {
    _id: "",
    name: "",
    type: "",
    path: "",
    commands: []
  };
  if (!name) {
    throw new Error("Invalid Command/Project Name");
  }

  project._id = uuidv4();

  project.name = name;

  project.type = type;

  if (projectPath === "") {
    project.path = path.normalize(__dirname);
  } else {
    project.path = path.normalize(projectPath);
  }

  const command: IProjectCommand = {
    name,
    cmd,
    execDir: "./"
  };

  if (!cmd) {
    throw new Error("Invalid Command. You might have missed entering command.");
  }

  project.commands = [command];

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
      await saveProject(project);
    }
  } catch (error) {
    console.log(chalk.redBright(error.message));
  }
};

startTenHands();
