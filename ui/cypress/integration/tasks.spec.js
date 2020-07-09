const {
  getFakeProjects,
  getFakePackageJson,
  getProjectFromPackageJson,
} = require("../support/generate");

describe("When no tasks in the project", () => {
  let project;
  before(() => {
    cy.clearLocalStorage();
    cy.clock();
    cy.visit("/");
    cy.server();
    cy.route("POST", "/utils/git-info", {});
    cy.fixture("task-test-project").then((p) => {
      project = p;
      cy.route({
        method: "GET",
        url: "/projects",
        response: [project],
      });
      cy.reload();
    });
  });

  it("Checks whether project is active", () => {
    cy.findByTestId("active-project-name").should("have.text", project.name);
  });
  it("Should have all tasks from the project in the project window", () => {
    const taskNames = project.commands.map((t) => t.name);
    taskNames.sort();
    cy.findAllByTestId("command-name").then((taskNameEls) => {
      expect(taskNames.length).to.equal(taskNameEls.length);
      Array.from(taskNameEls).forEach((el, i) => {
        expect(el.textContent).to.equal(taskNames[i]);
      });
    });
  });
  it("Should run the first task", () => {
    const firstTask = project.commands[0];
    // Uncomment this to see task output in xterm canvas
    // cy.clock().invoke("restore");
    const firstStartButton = null;
    const firstStopButton = null;

    // Cannot read the content of the xtermjs canvas.
    // So, let's just test if start button, stop button worked
    // The dummy-file.js has a timer which runs for 5 seconds.
    // So see if the buttons worked. And we can check the task output visually manually.
    // Also verify the task count on status bar
    cy.findByTestId("total-running-task-count").should(
      "have.text",
      "Total running tasks: 0"
    );
    cy.get(`#task-card-${firstTask._id}`).then((taskCard) => {
      cy.findByTestId("start-task-button", { container: taskCard }).click();

      // cy.findByTestId("start-task-button", { container: taskCard }).should(
      //   "be.disabled"
      // );
      // cy.findByTestId("stop-task-button", { container: taskCard }).should(
      //   "not.be.disabled"
      // );
      cy.findByTestId("total-running-task-count").should(
        "have.text",
        "Total running tasks: 1"
      );
      cy.findByTestId("project-running-task-count").should(
        "have.text",
        "Tasks running in this project: 1"
      );
      cy.wait(5000);
      // cy.findByTestId("start-task-button", { container: taskCard }).should(
      //   "not.be.disabled"
      // );
      // cy.findByTestId("stop-task-button", { container: taskCard }).should(
      //   "be.disabled"
      // );
      cy.findByTestId("total-running-task-count").should(
        "have.text",
        "Total running tasks: 0"
      );
      cy.findByTestId("project-running-task-count").should(
        "have.text",
        "Tasks running in this project: 0"
      );
    });
    cy.wait(1000);

    // cy.clock();
  });
  it("Adds new task", () => {
    cy.findByRole("button", { name: /New Task/i }).click();
    let taskName = "Best task in the workd";
    let task = "node dummy-file.js";
    cy.server();
    cy.route({
      method: "POST",
      url: `/projects/${project._id}/commands`,
      response: { _id: "best-task-id", name: taskName },
    });
    cy.findByTestId("new-task-form").within((form) => {
      cy.findByLabelText(/Name/).type(taskName);
      cy.findByLabelText(/Task/).type(task);
      cy.wrap(form).submit();
    });
    cy.wait(1000);

    cy.findAllByTestId("command-name").then((allCommandEls) => {
      const names = Array.from(allCommandEls).map((cmd) => cmd.textContent);
      expect(names).to.contain(taskName);
    });
  });
  it("Checks delete task", () => {
    const firstStartButton = null;
    const firstStopButton = null;
    const tasks = project.commands;
    tasks.sort();
    const taskNames = tasks.map((t) => t.name);
    const firstTask = tasks[0];
    const secondTask = tasks[1];
    cy.get(`#task-card-${firstTask._id}`).should("exist");
    cy.get(`#task-card-${secondTask._id}`).should("exist");
    cy.get(`#task-card-${firstTask._id}`)
      .find("[data-testid='delete-task-button']")
      .click();
    cy.get(`#task-card-${firstTask._id}`).should("not.exist");
    cy.get(`#task-card-${secondTask._id}`).should("exist");
  });
});
