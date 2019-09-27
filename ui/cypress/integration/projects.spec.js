import { getFakeProjects, getFakePackageJson } from "../support/generate";

describe.skip("Test Project Add/Remove", () => {
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
  it("Tests new project upload", () => {
    cy.getByTestId("new-project-button").click();
    cy.wait(1000);
    const fakeProject = getFakeProjects(1)[0];
    cy.getByTestId("new-project-form").then(subject => {
      const fileName = "package.json";
      const fileContent = getFakePackageJson(fakeProject);
      cy.get("#configFile").upload({
        fileContent: JSON.stringify(fileContent),
        fileName,
        mimeType: "application/json"
      });

      cy.wait(500);

      cy.getByLabelText(/project name/i, { container: subject }).should(
        "have.value",
        fileContent.name
      );
      cy.getByLabelText(/project type/i, { container: subject }).should(
        "have.value",
        "nodejs"
      );

      cy.route({
        method: "POST",
        url: "/projects",
        response: fakeProject
      });

      cy.getAllByTestId("new-project-task-row", { container: subject }).then(
        taskRows => {
          const scriptKeys = Object.keys(fileContent.scripts);
          const scriptValues = Object.values(fileContent.scripts);
          Array.from(taskRows).forEach((row, i) => {
            expect(row).to.contain(scriptKeys[i]);
            expect(row).to.contain(scriptValues[i]);
          });
        }
      );

      cy.getByTestId("save-project-button").click();
    });

    cy.wait(2000);

    cy.getAllByTestId("project-name").then(sidebarProjectnames => {
      const oneWithAddedProjectName = Array.from(sidebarProjectnames).filter(
        x => x.textContent === fakeProject.name
      );
      console.log("oneWithAddedProjectName:", oneWithAddedProjectName);
      expect(oneWithAddedProjectName).to.have.length(1);
    });
    cy.getByTestId("active-project-name").should("have.text", fakeProject.name);
  });

  it.only("Removes project", () => {
    const secondProject = fakeProjects[1];
    cy.getAllByTestId("project-name").then(sidebarProjectnames => {
      const projectSidebarItem = cy.wrap(
        Array.from(sidebarProjectnames).filter(
          x => x.textContent === secondProject.name
        )
      );
      projectSidebarItem.click();
    });

    cy.getByTestId("project-settings-button").click();
    cy.getByTestId("delete-project-menu-item").click();
    cy.getByTestId("delete-project-warning").should(
      "have.text",
      `Are you sure you want to delete project ${secondProject.name}?`
    );
    cy.getByText(/yes, delete/i).click();
    cy.wait(2000);

    cy.getAllByTestId("project-name").then(sidebarProjectnames => {
      const oneWithRemovedProjectName = Array.from(sidebarProjectnames).filter(
        x => x.textContent === secondProject.name
      );
      expect(oneWithRemovedProjectName).to.have.length(0);
    });
    cy.getByTestId("active-project-name").should(
      "not.have.text",
      secondProject.name
    );
  });

  it.only("Deletes all projects", () => {
    let projectsCount = 2;
    const fakeProjects = getFakeProjects(projectsCount);
    cy.route({
      method: "GET",
      url: "/projects",
      response: fakeProjects
    });

    while (projectsCount-- > 0) {
      cy.getByTestId("project-settings-button").click();
      cy.getByTestId("delete-project-menu-item").click();
      cy.getByText(/yes, delete/i).click();
      cy.wait(2000);
    }

    cy.queryByTestId("no-projects-message").should("exist");
  });
});
