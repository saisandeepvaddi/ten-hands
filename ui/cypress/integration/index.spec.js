describe.skip("Tests App top-most ui", () => {
  before(() => {
    cy.visit("/");
  });

  it("Checks if topbar loaded", () => {
    cy.get(".bp3-fixed-top > .bp3-align-left > .bp3-navbar-heading").should(
      "have.text",
      "Ten Hands"
    );
  });

  it("Checks if theme button is working", () => {
    cy.getByTestId("theme-light").click();
    cy.wait(2000);
    cy.getByTestId("theme-dark").click();
  });

  it("Checks if new project button works", () => {
    cy.getByTestId("new-project-button").then(subject => {
      subject.click();
      cy.wait(1000);
      cy.get(".bp3-drawer").then(subject => {
        cy.getByText("Add Project", { container: subject }).should("exist");
        cy.getByText("Project Name", { container: subject }).should("exist");
        cy.getByText("Project Path", { container: subject }).should("exist");
        cy.getByText("Project Type", { container: subject }).should("exist");
        cy.getByText("Tasks", { container: subject }).should("exist");
        cy.getByText("Save Project", { container: subject }).should("exist");
      });
    });
  });
});

describe("Checks Project", () => {
  before(() => {
    cy.visit("/");
    // I added project folder of 'ten-hands'. If you have cloned this project add one before this test case.
    cy.get(".Pane1").then(sidebar => {
      cy.getByText("ten-hands", { container: sidebar })
        .click()
        .wait(2000);
    });
  });

  it("Checks ten-hands project exists", () => {
    cy.getByText("New Task")
      .should("exist")
      .getByText("build:desktop")
      .should("exist")
      .getByText("yarn build:desktop")
      .should("exist");
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
