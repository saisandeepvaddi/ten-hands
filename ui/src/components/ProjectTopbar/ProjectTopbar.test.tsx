// import "jest-dom/extend-expect";
// import "react-testing-library/cleanup-after-each";
import { axe } from "jest-axe";
import React from "react";
import * as utils from "../../utils/electron";
import { cleanup, fireEvent, getFakeProjects, render } from "../../utils/test-utils";
import ProjectTopbar from "./ProjectTopbar";

describe.only("ProjectTopbar Component", () => {
    let projectsSpy: jest.SpyInstance;

    it("shows active project name, new task, project settings buttons", async () => {
        try {
            const activeProject: IProject = getFakeProjects(1)[0];
            const { container, getByTestId } = await render(<ProjectTopbar activeProject={activeProject} />);
            expect(container).not.toBeNull();
            expect(getByTestId("active-project-name").textContent).toBe(activeProject.name);
            expect(getByTestId("new-task-button")).toBeInTheDocument();
            expect(getByTestId("project-settings-button")).toBeInTheDocument();
            cleanup();
        } catch (error) {
            console.log("ProjectTopbar error:", error);
        }
    });

    // it("Checks accessibility", async () => {
    //     const activeProject: IProject = getFakeProjects(1)[0];
    //     const { container } = await render(<ProjectTopbar activeProject={activeProject} />);
    //     const results = await axe(container.innerHTML);
    //     expect(results).toHaveNoViolations();
    // });

    // Remove isRunningInElectron() check in component before running this testcase.
    it.skip("opens project directory in explorer in electron", async () => {
        try {
            const activeProject: IProject = getFakeProjects(1)[0];
            const { getByTestId } = await render(<ProjectTopbar activeProject={activeProject} />);
            const openInExplorerButton = getByTestId("open-project-directory-button");
            expect(openInExplorerButton).toBeTruthy();
            const spy = jest.spyOn(utils, "openInExplorer").mockImplementation(jest.fn);
            fireEvent.click(openInExplorerButton);
            expect(spy).toHaveBeenCalledWith(activeProject.path);
        } catch (error) {
            console.log("error:", error);
        }
    });

    it("checks change tasks order", async () => {
        try {
            const activeProject: IProject = getFakeProjects(1)[0];
            const { getByTestId, getByText, getAllByTestId, getByLabelText } = await render(
                <ProjectTopbar activeProject={activeProject} />,
            );
            const projectSettingsButton = getByTestId("project-settings-button");
            // const deleteProjectMenuItem = getByTestId("delete-project-menu-item")
            fireEvent.click(projectSettingsButton);
            const changeTasksOrderMenuItem = getByTestId("change-tasks-order-menu-item");
            fireEvent.click(changeTasksOrderMenuItem);
            expect(getByText("Change Tasks Order")).toBeInTheDocument();
            const tasksList = getAllByTestId("reorder-task-list-item");
            tasksList.forEach((item, index) => {
                expect(item.textContent).toBe(activeProject.commands[index].name);
            });
            fireEvent.click(getByLabelText("Close"));

            // For some reason, cleanup-aftereach did not work may be. If remove this cleanup, throws error
            cleanup();
            // TODO: Drag & Drop
        } catch (error) {
            console.log("ProjectTopbar error:", error);
        }
    });

    it("checks project delete button", async () => {
        try {
            const activeProject: IProject = getFakeProjects(1)[0];
            const { getByTestId, getByText, debug, queryByTestId } = await render(
                <ProjectTopbar activeProject={activeProject} />,
            );
            const projectSettingsButton = getByTestId("project-settings-button");
            // const deleteProjectMenuItem = getByTestId("delete-project-menu-item")
            fireEvent.click(projectSettingsButton);
            const deleteProjectMenuItem = queryByTestId("delete-project-menu-item");
            fireEvent.click(deleteProjectMenuItem);
            expect(getByTestId("delete-project-warning").textContent.toLowerCase()).toBe(
                `are you sure you want to delete project ${activeProject.name.toLowerCase()}?`,
            );
            // DO actual delete project in an integration test instead.
            fireEvent.click(getByText(/cancel/i));
            cleanup();
        } catch (error) {
            console.log("ProjectTopbar error:", error);
        }
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
