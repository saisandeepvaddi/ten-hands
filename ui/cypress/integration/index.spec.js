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
});
