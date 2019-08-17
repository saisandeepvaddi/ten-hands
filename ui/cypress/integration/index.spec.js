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

  // I added project folder of 'ten-hands'. If you have cloned this project add one before this test case.
  it.only("Opens test project", () => {
    cy.get(".Pane1").then(sidebar => {
      cy.getByText("ten-hands", { container: sidebar })
        .click()
        .wait(2000)
        .getByText("New Command")
        .should("exist")
        .getByText("build:desktop")
        .should("exist")
        .getByText("yarn build:desktop")
        .should("exist");
    });
  });
});
