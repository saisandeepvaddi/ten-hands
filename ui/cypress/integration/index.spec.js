describe("Tests App top-most ui", () => {
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

  it.only("Checks if new project button works", () => {
    cy.getByTestId("new-project-button").then(subject => {
      subject.click();
      cy.wait(1000);
      cy.get(".bp3-drawer").then(subject => {
        cy.getByText("Add Project", { container: subject }).should("exist");
        cy.getByText("Project Name", { container: subject }).should("exist");
        cy.getByText("Project Path", { container: subject }).should("exist");
        cy.getByText("Project Type", { container: subject }).should("exist");
        cy.getByText("Commands", { container: subject }).should("exist");
        cy.getByText("Save Project", { container: subject }).should("exist");
      });
    });
  });
});

describe.only("Checks Project", () => {
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
    cy.getByText("New Command")
      .should("exist")
      .getByText("build:desktop")
      .should("exist")
      .getByText("yarn build:desktop")
      .should("exist");
  });

  it("Checks New Command UI", () => {
    cy.getByText("New Command")
      .click()
      .get(".bp3-drawer")
      .then(drawer => {
        cy.getByText("Add Command", { container: drawer }).should("exist");
        cy.getByText("Name", { container: drawer }).should("exist");
        cy.getByText("Path", { container: drawer }).should("exist");
        cy.getByText("Command", { container: drawer }).should("exist");
        cy.getByText("Save Command", { container: drawer }).should("exist");
      });
  });

  it("Adds a command", () => {
    cy.getByLabelText(/name/i).type("Test Command");
    cy.getByLabelText(/command/i).type("node dummy-file.js");
    cy.getByTestId("save-command-button").click();
    cy.wait(2000);
    cy.getByText("Test Command").should("exist");
    cy.getByText("node dummy-file.js").should("exist");
    cy.getByText("node dummy-file.js")
      .scrollIntoView({ easing: "linear" })
      .should("be.visible");
  });

  it("Runs a command", () => {
    cy.getByText("Test Command")
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
        cy.wait(5000); // By that time dummy task is disabled
        cy.getByTestId(/start-task-button/i, { container: card }).should(
          "not.be.disabled"
        );
        cy.getByTestId(/stop-task-button/i, { container: card }).should(
          "be.disabled"
        );
      });
  });

  after(() => {
    // Delete the added command in the end

    cy.getByText("node dummy-file.js")
      .scrollIntoView({ easing: "linear" })
      .should("be.visible");

    cy.getByText("Test Command")
      .closest(".bp3-card")
      .then(card => {
        cy.getByTitle("Delete Task", { container: card });
      })
      .click()
      .wait(1000);

    cy.getByText(/Are you sure you want to delete/gi).should("exist");

    cy.getByText("Yes, Delete")
      .click()
      .wait(2000);

    cy.queryByText("node dummy-file.js").should("not.exist");
  });
});
