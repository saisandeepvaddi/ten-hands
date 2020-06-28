import { arrayOf, build, fake, sequence } from "test-data-bot";

export const commandBuilder = build("Command").fields({
  _id: fake((f) => f.random.uuid()),
  name: fake((f) => f.random.word()),
  cmd: fake((f) => f.random.words()),
  execDir: "",
});

/**
 *
 * @returns IProject[]
 */
export const projectBuilder = build("Project").fields({
  _id: fake((f) => f.random.uuid()),
  name: fake((f) => f.random.word()),
  path: fake((f) => f.fake("D:\\{{random.word}}\\{{random.word}}")),
  commands: arrayOf(commandBuilder, Math.ceil(Math.random() * 5 + 0)),
  taskSortOrder: "name-asc",
  shell: "",
});

export const packageJsonBuilder = build("PackageJSON").fields({
  name: fake((f) => f.random.word()),
  version: "1.0.0",
  scripts: {
    start: "npm run start",
    test: "npm run test",
  },
});

export const getFakePackageJson = (project = getFakeProjects(1)[0]) => {
  let scripts = {};
  project.commands.forEach((command) => {
    scripts[command.name] = `npm run ${command.name}`;
  });

  const packageJson = {
    name: project.name,
    version: "1.0.0",
    scripts,
    tenHands: {
      path: project.path,
    },
  };

  return packageJson;
};

export const getFakeProjects = (n = 5) => {
  const projects = [];

  while (n-- > 0) {
    const newProject = projectBuilder();
    projects.push(newProject);
  }

  return projects;
};
