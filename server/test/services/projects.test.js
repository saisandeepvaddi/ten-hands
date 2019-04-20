const app = require("../../src/app");

describe.only("'projects' service", () => {
  it("registered the service", () => {
    const service = app.service("projects");
    expect(service).toBeTruthy();
  });

  it("creates a project", async () => {
    const projectsBefore = await app.service("projects").find();
    const project = await app.service("projects").create({
      name: "test"
    });
    expect(project).toHaveProperty("_id");
    const projectsAfter = await app.service("projects").find();
    expect(projectsAfter.length).toBe(projectsBefore.length + 1);
  });

  it.only("updates a project", async () => {
    const projects = await app.service("projects").find({
      query: {
        $limit: 1
      }
    });

    const newName = "updated_name_" + Math.random() * 100;
    const updatedProject = await app
      .service("projects")
      .update(projects[0]._id, {
        name: newName
      });

    expect(updatedProject.name).toEqual(newName);
  });
});
