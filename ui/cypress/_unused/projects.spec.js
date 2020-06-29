import { getFakeProjects, getFakePackageJson } from "../support/generate";

describe("Test Project Add/Remove", () => {
  const fakeProjects = getFakeProjects(5);
  before(() => {
    cy.visit("/");
    cy.server();
    cy.route({
      method: "GET",
      url: "/projects",
      response: fakeProjects,
    });
    cy.route({
      method: "DELETE",
      url: "/projects",
      response: {},
    });
  });
  it.only("Shows all projects on sidebar", () => {
    cy.findByTestId("project-list-container").then((subject) => {
      cy.findAllByTestId("project-name", { container: subject }).then(
        (projectNameEls) => {
          const projectNames = Array.from(projectNameEls).map(
            (span) => span.textContent
          );
          fakeProjects.forEach((project) =>
            expect(projectNames).to.contain(project.name)
          );
        }
      );
    });
  });
  it("Tests new project upload", () => {
    cy.findByTestId("new-project-button").click();
    cy.wait(1000);
    const fakeProject = getFakeProjects(1)[0];
    cy.findByTestId("new-project-form").then((subject) => {
      const fileName = "package.json";
      const fileContent = getFakePackageJson(fakeProject);
      cy.get("#configFile").upload({
        fileContent: JSON.stringify(fileContent),
        fileName,
        mimeType: "application/json",
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
        response: fakeProject,
      });

      cy.findAllByTestId("new-project-task-row", { container: subject }).then(
        (taskRows) => {
          const scriptKeys = Object.keys(fileContent.scripts);
          const scriptValues = Object.values(fileContent.scripts);
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
        (x) => x.textContent === fakeProject.name
      );
      console.log("oneWithAddedProjectName:", oneWithAddedProjectName);
      expect(oneWithAddedProjectName).to.have.length(1);
    });
    cy.findByTestId("active-project-name").should(
      "have.text",
      fakeProject.name
    );
  });

  it("Renames a project", () => {
    cy.wait(2000);
    const firstProject = fakeProjects[0];
    let updatedName = firstProject.name + "-updated";

    cy.route({
      method: "PATCH",
      url: "/projects",
      response: {
        ...firstProject,
        name: updatedName,
      },
    });
    cy.findByTestId("project-settings-button").click();
    cy.findByTestId("rename-project-menu-item").click();
    cy.getByText(`Rename project: ${firstProject.name}`).should("exist");
    cy.findByTestId("updated-project-name").type(firstProject.name);
    cy.findByTestId("rename-project-form").submit();
    cy.getByText(/project name already exists/i).should("exist");
    cy.findByTestId("updated-project-name")
      .clear()
      .type(updatedName);
    cy.findByTestId("rename-project-form").submit();
    cy.wait(2000);
    cy.findByTestId("active-project-name").should("have.text", updatedName);
  });

  it("Removes project", () => {
    const secondProject = fakeProjects[1];
    cy.findAllByTestId("project-name").then((sidebarProjectnames) => {
      const projectSidebarItem = cy.wrap(
        Array.from(sidebarProjectnames).filter(
          (x) => x.textContent === secondProject.name
        )
      );
      projectSidebarItem.click();
    });

    cy.findByTestId("project-settings-button").click();
    cy.findByTestId("delete-project-menu-item").click();
    cy.findByTestId("delete-project-warning").should(
      "have.text",
      `Are you sure you want to delete project ${secondProject.name}?`
    );
    cy.getByText(/yes, delete/i).click();
    cy.wait(2000);

    cy.findAllByTestId("project-name").then((sidebarProjectnames) => {
      const oneWithRemovedProjectName = Array.from(sidebarProjectnames).filter(
        (x) => x.textContent === secondProject.name
      );
      expect(oneWithRemovedProjectName).to.have.length(0);
    });
    cy.findByTestId("active-project-name").should(
      "not.have.text",
      secondProject.name
    );
  });

  it("Deletes all projects", () => {
    let projectsCount = 2;
    const fakeProjects = getFakeProjects(projectsCount);
    cy.route({
      method: "GET",
      url: "/projects",
      response: fakeProjects,
    });

    while (projectsCount-- > 0) {
      cy.findByTestId("project-settings-button").click();
      cy.findByTestId("delete-project-menu-item").click();
      cy.getByText(/yes, delete/i).click();
      cy.wait(2000);
    }

    cy.queryByTestId("no-projects-message").should("exist");
  });
});
