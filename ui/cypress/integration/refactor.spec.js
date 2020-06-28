describe("Test Projects", () => {
  before(() => {
    cy.visit("/");
    cy.server();
    cy.route({
      method: "GET",
      url: "/projects/*",
      response: "fixture:projects.json",
    });
  });
  it.only("Shows all projects on sidebar", () => {
    cy.findByTestId("project-list-container").then((subject) => {
      cy.fixture("projects").then((projects) => {
        cy.findAllByTestId("project-name", { container: subject }).then(
          (projectNameEls) => {
            const projectNamesOnUI = Array.from(projectNameEls).map(
              (el) => el.textContent
            );
            console.log("projectNamesOnUI:", projectNamesOnUI);
            const projectNamesFromFixture = projects.map(
              (project) => project.name
            );
            console.log("projectNamesFromFixture:", projectNamesFromFixture);
            expect(projectNamesOnUI.sort()).to.deep.equal(
              projectNamesFromFixture.sort()
            );
          }
        );
      });
    });
  });
});
