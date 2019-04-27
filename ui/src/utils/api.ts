const projects = [
  {
    id: "1",
    name: "Project 1",
    type: "node",
    configFile: "package.json",
    commands: [
      {
        start: "yarn start"
      },
      {
        dev: "yarn dev"
      },
      {
        test: "yarn test"
      }
    ]
  },
  {
    id: "2",
    name: "Project 2",
    type: "node",
    configFile: "package.json",
    commands: [
      {
        start: "yarn start"
      },
      {
        dev: "yarn dev"
      },
      {
        test: "yarn test"
      }
    ]
  }
];

export const getProjects: () => Promise<any> = async () => {
  try {
    return Promise.resolve(projects);
  } catch (error) {
    console.log("error:", error);
  }
};
