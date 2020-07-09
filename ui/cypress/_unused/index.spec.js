import { getFakeProjects } from "../support/generate";

describe("Tests App top-most ui", () => {
  before(() => {
    cy.visit("/");
    cy.server();
  });

  it.only("Checks if topbar loaded", () => {
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

  // TODO: NOT WORKING
  it.skip("Reorders projects", () => {
    const fakeProjects = getFakeProjects(5);
    cy.route({
      method: "GET",
      url: "/projects",
      response: fakeProjects,
    });
    cy.wait(200);

    cy.getByText(fakeProjects[1].name).then((el) => {
      const coords = el[0].getBoundingClientRect();
      cy.wrap(el)
        .trigger("click")
        .trigger("mousedown", {
          button: 0,
          clientX: coords.x,
          clientY: coords.y,
        })
        .trigger("mousemove", {
          button: 0,
          clientX: coords.x,
          clientY: coords.y + 50,
        })
        .trigger("mouseup", { force: true });
    });
  });
});
