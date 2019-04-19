const server = require("../index");

describe("Server", () => {
  let projects = [];

  beforeAll(async () => {
    projects = await server.getAllProjects();
  });

  it("should get all projects", async () => {
    expect(projects.length).toBeGreaterThanOrEqual(1);
  });

  it("should have id _dont_use_this_name for test project", async () => {
    expect(projects.map(x => x.id)).toContain("_dont_use_this_name");
  });

  it("should create a new project", async () => {
    const projectsBefore = await server.getAllProjects();
    const projectData = {
      name: "test",
      path: "D:\\Programming\\ten-hands\\server",
      projectType: "",
      configFile: "",
      commands: []
    };
    const newProject = await server.addProject(projectData);
    expect(Object.keys(newProject)).toContain("id");
    const projectsAfter = await server.getAllProjects();
    expect(projectsAfter.length).toBe(projectsBefore.length + 1);
  });
});
