const path = require("path");
const fs = require("fs");
const promisify = require("util").promisify;
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const uuidv4 = require("uuid/v4");

async function getAllProjects() {
  const projectsPath = path.resolve(__dirname, "projects");
  const projectFiles = await readdir(projectsPath);

  const projects = await Promise.all(
    projectFiles.map(file => require(path.join(projectsPath, file)))
  );

  return projects;
}

async function addProject(projectData) {
  const projectsPath = path.resolve(__dirname, "projects");
  const id = uuidv4();
  const project = {
    id,
    ...projectData
  };

  await writeFile(
    path.join(projectsPath, `${id}.project.json`),
    JSON.stringify(project, null, 2)
  );

  return project;
}

module.exports = {
  getAllProjects,
  addProject
};
