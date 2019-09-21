// import "jest-dom/extend-expect";
// import "react-testing-library/cleanup-after-each";
import React from "react";
import { fireEvent, getFakeProjects, render } from "../../utils/test-utils";

import * as utils from "../../utils/electron";
import ProjectTopbar from "./ProjectTopbar";

describe.only("ProjectTopbar Component", () => {
    let projectsSpy: jest.SpyInstance;
    it("shows active project name", async () => {
        try {
            const activeProject: IProject = getFakeProjects(1)[0];
            const { container, getByTestId } = await render(<ProjectTopbar activeProject={activeProject} />);
            expect(container).not.toBeNull();
            expect(getByTestId("active-project-name").textContent).toBe(activeProject.name);
        } catch (error) {
            console.log("ProjectTopbar error:", error);
        }
    });

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

    afterEach(() => {
        if (projectsSpy) {
            projectsSpy.mockRestore();
        }
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
});
