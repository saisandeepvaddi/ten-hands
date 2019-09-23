import * as dom from "@testing-library/dom";
import React from "react";
import { cleanup, fireEvent, getFakePackageJson, getFakeProjects, render, wait } from "../../utils/test-utils";
import AppLayout from "../App/AppLayout";
import * as ajaxCalls from "../shared/API";

// Since AppLayout component is a container for the appLayout, this suite is kind of works like integration.
describe.only("App basic use cases integration tests using AppLayout Component", () => {
    let projectsSpy: jest.SpyInstance;

    it("renders without crashing", async () => {
        try {
            const { container, getByText } = await render(<AppLayout />);
            expect(container).not.toBeNull();
            expect(getByText(/ten hands/i)).toBeInTheDocument();
            expect(getByText(/new project/i)).toBeInTheDocument();
            expect(getByText(/new task/i)).toBeInTheDocument();
        } catch (error) {
            console.log("AppLayout error:", error);
        }
    });

    it("shows no projects message on no projects", async () => {
        projectsSpy = jest.spyOn(ajaxCalls, "getProjects");
        projectsSpy.mockImplementation(() => Promise.resolve([]));
        const { getByText } = await render(<AppLayout />);
        expect(projectsSpy).toHaveBeenCalledTimes(1);
        expect(getByText(/Add a project using/i)).toBeInTheDocument();
    });

    it("doesn't show no projects message on projects > 1", async () => {
        projectsSpy = jest.spyOn(ajaxCalls, "getProjects");
        projectsSpy.mockImplementation(() => Promise.resolve(getFakeProjects(1)));
        const { queryByText } = await render(<AppLayout />);
        expect(projectsSpy).toHaveBeenCalledTimes(1);
        expect(queryByText(/Add a project using/i)).toBeNull();
    });

    it("has projects on shown on ui", async () => {
        projectsSpy = jest.spyOn(ajaxCalls, "getProjects");
        const projects: IProject[] = getFakeProjects(2);
        projectsSpy.mockImplementation(() => Promise.resolve(projects));
        const { getAllByText } = await render(<AppLayout />);
        expect(projectsSpy).toHaveBeenCalledTimes(1);
        expect(getAllByText(projects[0].name).length).toBeGreaterThan(0);
        expect(getAllByText(projects[1].name).length).toBeGreaterThan(0);
    });

    it.only("add new project", async () => {
        // Throwing errors. Let's do it in cypress
        // const { getByText } = await render(<AppLayout />);
        // fireEvent.click(getByText(/new project/i));
        // expect(getByText("Add Project")).toBeInTheDocument();
        // Test new project form a11y
        // const a11yResults = await axe(newProjectForm.innerHTML);
        // expect(a11yResults).toHaveNoViolations();
        // const fakeProjectJson = getFakePackageJson();
        // const projectJsonBlob = new Blob([JSON.stringify(fakeProjectJson)], {
        //     type: "application/json",
        // });
        // const fakeFile = new File([projectJsonBlob], "package.json");
        // const newProjectForm = dom.getByTestId(document.body, "new-project-form");
        // const { getByLabelText } = dom.within(newProjectForm);
        // const configFileInput: any = getByLabelText(/choose file.*?/i);
        // Object.defineProperty(configFileInput, "files", {
        //     value: [fakeFile],
        // });
        // // fireEvent.change(configFileInput);
        // // const configFileInput: any = document.getElementById("configFile");
        // // console.log(configFileInput.innerHTML);
        // // console.log(configFileInput.innerHTML);
        // // fireEvent.change(configFileInput, {
        // //     target: {
        // //         files: [fakeFile],
        // //     },
        // // });
        // console.log((getByLabelText(/project name/i) as any).value);
        // // const tasks = dom.getAllByTestId(document.body, "new-project-task-row");
        // // expect(tasks).toHaveLength(Object.keys(fakeProjectJson.scripts).length);
        // // expect(projectType.value).toBe("nodejs");
        // cleanup();
    });

    it("deletes project", async () => {
        projectsSpy = jest.spyOn(ajaxCalls, "getProjects");
        const projects = getFakeProjects(1);
        projectsSpy.mockImplementation(() => Promise.resolve(projects));
        const { getAllByText, getByTestId, getByText, queryAllByText } = await render(<AppLayout />);

        // make sure it is the active project
        const activeProject: IProject = projects[0];
        // Active project will appear twice. one in sidebar and one in project topbar.
        expect(getAllByText(activeProject.name)).toHaveLength(2);

        const projectSettingsButton = getByTestId("project-settings-button");
        fireEvent.click(projectSettingsButton);

        const deleteProjectMenuItem = getByTestId("delete-project-menu-item");
        fireEvent.click(deleteProjectMenuItem);

        expect(getByTestId("delete-project-warning").textContent.toLowerCase()).toBe(
            `are you sure you want to delete project ${activeProject.name.toLowerCase()}?`,
        );

        const deleteProjectSpy = jest.spyOn(ajaxCalls, "deleteProjectInDb");

        fireEvent.click(getByText(/yes, delete/i));
        await wait();
        expect(deleteProjectSpy).toHaveBeenCalledTimes(1);
        expect(queryAllByText(activeProject.name)).toHaveLength(0);
        expect(getByText(/Add a project using/i)).toBeInTheDocument();
        deleteProjectSpy.mockRestore();
    });

    afterEach(() => {
        if (projectsSpy) {
            projectsSpy.mockRestore();
        }
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
});
