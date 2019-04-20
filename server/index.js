const path = require("path");
const fs = require("fs-extra");
const uuidv4 = require("uuid/v4");

async function getAllProjects() {
  const projectsPath = path.resolve(__dirname, "projects");
  let projectFiles = [];
  let projects = [];
  try {
    projectFiles = await fs.readdir(projectsPath);
    projects = await Promise.all(
      projectFiles.map(async file =>
        JSON.parse(await fs.readFile(path.join(projectsPath, file), "utf8"))
      )
    );
  } catch (error) {
    console.error(error);
    throw new Error("Could not get all projects");
  }

  return projects;
}

async function addProject(projectData) {
  const projectsPath = path.resolve(__dirname, "projects");
  const id = uuidv4();
  const project = {
    id,
    ...projectData
  };

  try {
    await fs.writeFile(
      path.join(projectsPath, `${id}.project.json`),
      JSON.stringify(project, null, 2)
    );
  } catch (error) {
    console.error(error);
    throw new Error("Could not add project.");
  }

  return project;
}

async function updateProject(project) {
  const { id } = project;
  const projectsPath = path.resolve(__dirname, "projects");
  try {
    await fs.writeFile(
      path.join(projectsPath, `${id}.project.json`),
      JSON.stringify(project, null, 2)
    );
  } catch (error) {
    console.error(error);
    throw new Error("Could not update project.");
  }

  return project;
}

module.exports = {
  getAllProjects,
  addProject,
  updateProject
};
