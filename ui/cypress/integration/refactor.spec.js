const {
  getFakeProjects,
  getFakePackageJson,
  getProjectFromPackageJson,
} = require("../support/generate");

describe("Test Projects", () => {
  let projects;
  before(() => {
    cy.clock();
    cy.visit("/");
    cy.server();
    cy.route({
      method: "GET",
      url: "/projects",
      response: "fixture:projects.json",
    });

    // Reload here to replace actual projects from my FS with proejct fixture stub
    cy.reload();
    cy.fixture("projects").then((projectsFromFixtures) => {
      projects = projectsFromFixtures;
    });
  });

  it("Shows all projects on sidebar", () => {
    cy.findByTestId("project-list-container").then((subject) => {
      cy.findAllByTestId("project-name", { container: subject }).then(
        (projectNameEls) => {
          const projectNamesOnUI = Array.from(projectNameEls).map(
            (el) => el.textContent
          );
          const projectNamesFromFixture = projects.map(
            (project) => project.name
          );
          expect(projectNamesOnUI.sort()).to.deep.equal(
            projectNamesFromFixture.sort()
          );
        }
      );
    });
  });

  it("Verifies first project to be default active project", () => {
    cy.findAllByTestId("project-name").then((projectNames) => {
      cy.findByTestId("active-project-name")
        .should("have.text", projectNames.get(0).textContent)
        .log();
    });
  });

  it.only("Tests new project upload", () => {
    cy.findByTestId("new-project-button").click();
    cy.wait(1000);
    const fileContent = require("../fixtures/test-package.json");
    const createdProject = getProjectFromPackageJson(fileContent);
    cy.findByTestId("new-project-form").then((subject) => {
      // const fileName = "package.json";
      // cy.get("input#configFile").attachFile({
      //   fileContent: JSON.stringify(fileContent),
      //   fileName,
      //   mimeType: "application/json",
      // });
      cy.get("input#configFile").attachFile("test-package.json");
      // const fileContent = getFakePackageJson(fakeProject);

      console.log("createdProject:", createdProject);
      cy.wait(500);

      cy.findByLabelText(/project name/i, { container: subject }).should(
        "have.value",
        createdProject.name
      );

      cy.findByLabelText(/project path/i, { container: subject }).type(
        createdProject.path
      );

      cy.route({
        method: "POST",
        url: "/projects",
        response: createdProject,
      });

      cy.findAllByTestId("new-project-task-row", { container: subject }).then(
        (taskRows) => {
          const scriptKeys = createdProject.commands.map((c) => c.name);
          const scriptValues = createdProject.commands.map((c) => c.cmd);
          Array.from(taskRows).forEach((row, i) => {
            expect(row).to.contain(scriptKeys[i]);
            expect(row).to.contain(scriptValues[i]);
          });
        }
      );

      cy.findByTestId("save-project-button").click();
    });

    cy.wait(2000);

    cy.findAllByTestId("project-name").then((sidebarProjectnames) => {
      const oneWithAddedProjectName = Array.from(sidebarProjectnames).filter(
        (x) => x.textContent === createdProject.name
      );
      expect(oneWithAddedProjectName).to.have.length(1);
    });
    cy.findByTestId("active-project-name").should(
      "have.text",
      createdProject.name
    );
  });
});
