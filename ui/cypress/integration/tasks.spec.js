import { getFakeProjects, getFakePackageJson } from "../support/generate";

describe("Test Project Add/Remove", () => {
  const fakeProjects = getFakeProjects(5);

  before(() => {
    cy.visit("/");
    cy.server();
    cy.route({
      method: "GET",
      url: "/projects",
      response: fakeProjects
    });
    cy.route({
      method: "DELETE",
      url: "/projects",
      response: {}
    });
  });

  it("Adds a new task", () => {
    const fakeTaskName = "random";
    const fakeTaskCmd = "npm run random";
    cy.route({
      method: "POST",
      url: ".*?/commands",
      response: {}
    });
    cy.route({
      method: "GET",
      url: "/projects",
      response: fakeProjects.map((project, i) => {
        if (i > 0) {
          return project;
        }
        const updatedProject = {
          ...project,
          commands: [
            ...project.commands,
            {
              _id: "some-random-id",
              name: fakeTaskName,
              cmd: fakeTaskCmd
            }
          ]
        };
        return updatedProject;
      })
    });
    cy.wait(500);
    cy.getByTestId("new-task-button").click();
    cy.getByLabelText(/name/i).type(fakeTaskName);
    cy.getByLabelText(/task/i).type(fakeTaskCmd);
    cy.getByText(/save task/i).click();
    cy.wait(2000);
    cy.getByText(fakeTaskName).should("exist");
    cy.getByText(fakeTaskName)
      .scrollIntoView({ easing: "linear" })
      .should("be.visible");
  });
});

// This test is only to verify visually that terminal actually printing stuff on play stop buttons.
// For that we need real interaction with backend.
// Make sure you add project folder of 'ten-hands' to the UI before running this suite.
describe.skip("Tests using real project - no stubs", () => {
  before(() => {
    cy.visit("/");
    cy.get(".Pane1").then(sidebar => {
      cy.getByText("ten-hands", { container: sidebar })
        .click()
        .wait(2000);
    });
  });

  it("Checks New Task UI", () => {
    cy.getByText("New Task")
      .click()
      .get(".bp3-drawer")
      .then(drawer => {
        cy.getByText("Add Task", { container: drawer }).should("exist");
        cy.getByText("Name", { container: drawer }).should("exist");
        cy.getByText("Path", { container: drawer }).should("exist");
        cy.getByText("Task", { container: drawer }).should("exist");
        cy.getByText("Save Task", { container: drawer }).should("exist");
      });
  });

  it("Adds a task", () => {
    cy.getByLabelText(/name/i).type("Test Task");
    cy.getByLabelText(/task/i).type("node dummy-file.js");
    cy.getByTestId("save-task-button").click();
    cy.wait(2000);
    cy.getByText("Test Task").should("exist");
    cy.getByText("node dummy-file.js").should("exist");
    cy.getByText("node dummy-file.js")
      .scrollIntoView({ easing: "linear" })
      .should("be.visible");
  });

  it("Runs a task", () => {
    cy.getByText("Test Task")
      .scrollIntoView({ easing: "linear" })
      .closest(".bp3-card")
      .then(card => {
        cy.getByTestId(/stop-task-button/i, { container: card }).should(
          "be.disabled"
        );
        cy.getByTestId(/start-task-button/i, { container: card }).click();
        cy.getByTestId(/stop-task-button/i, { container: card }).should(
          "not.be.disabled"
        );
        cy.wait(8000); // By that time dummy task is disabled
        cy.getByTestId(/start-task-button/i, { container: card }).should(
          "not.be.disabled"
        );
        cy.getByTestId(/stop-task-button/i, { container: card }).should(
          "be.disabled"
        );
      });
  });

  after(() => {
    // Delete the added task in the end

    cy.getByText("node dummy-file.js")
      .scrollIntoView({ easing: "linear" })
      .should("be.visible");

    cy.getByText("Test Task")
      .closest(".bp3-card")
      .then(card => {
        cy.getByTitle("Delete Task", { container: card });
      })
      .click()
      .wait(1000);

    cy.queryByText("node dummy-file.js").should("not.exist");
  });
});
