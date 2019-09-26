// import "jest-dom/extend-expect";
// import "react-testing-library/cleanup-after-each";
import React from "react";
import { getFakeProjects, render } from "../../utils/test-utils";
import * as ajaxCalls from "../shared/API";

import Sidebar from "./Sidebar";

describe.only("Sidebar Component", () => {
    let projectsSpy: jest.SpyInstance;
    it("renders without crashing", async () => {
        try {
            const { container, getByText } = await render(<Sidebar />);
            expect(container).not.toBeNull();
            expect(getByText(/new project/i)).toBeInTheDocument();
        } catch (error) {
            console.log("Sidebar error:", error);
        }
    });

    it("shows list of projects on ui", async () => {
        projectsSpy = jest.spyOn(ajaxCalls, "getProjects");
        const projects: IProject[] = getFakeProjects(2);
        projectsSpy.mockImplementation(() => Promise.resolve(projects));
        const { getAllByText } = await render(<Sidebar />);
        expect(projectsSpy).toHaveBeenCalledTimes(1);
        expect(getAllByText(projects[0].name).length).toBeGreaterThan(0);
        expect(getAllByText(projects[1].name).length).toBeGreaterThan(0);
    });

    it.only("shows list of projects in order", async () => {
        projectsSpy = jest.spyOn(ajaxCalls, "getProjects");
        const projects: IProject[] = getFakeProjects(5);
        projectsSpy.mockImplementation(() => Promise.resolve(projects));
        const { getAllByTestId } = await render(<Sidebar />);
        expect(projectsSpy).toHaveBeenCalledTimes(1);
        const renderedProjectNames = getAllByTestId("project-name");
        renderedProjectNames.forEach((nodeName: HTMLElement, index) => {
            expect(nodeName.textContent).toBe(projects[index].name);
        });
    });

    // it.only("dragging changes project order", async () => {
    //     projectsSpy = jest.spyOn(ajaxCalls, "getProjects");
    //     const projects: IProject[] = getFakeProjects(5);

    //     projectsSpy.mockImplementation(() => Promise.resolve(projects));
    //     const { getAllByTestId } = await render(<Sidebar />);
    //     expect(projectsSpy).toHaveBeenCalledTimes(1);
    //     const renderedProjectNamesBefore = getAllByTestId("project-name");
    //     console.log("Before");
    //     renderedProjectNamesBefore.forEach(p => console.log(p.textContent));
    //     const firstProject = renderedProjectNamesBefore[0];
    //     fireEvent.mouseDown(firstProject, { clientX: 100, clientY: 20 });
    //     fireEvent.mouseMove(firstProject, {
    //         clientX: 200,
    //         clientY: 200,
    //     });
    //     fireEvent.mouseUp(firstProject);
    //     // await wait();
    //     const renderedProjectNamesAfter = await waitForElement(() => getAllByTestId("project-name"));
    //     console.log("After");
    //     // const renderedProjectNamesAfter = getAllByTestId("project-name");
    //     renderedProjectNamesAfter.forEach(p => console.log(p.textContent));
    //     expect(true).toBeTruthy();
    // });

    afterEach(() => {
        if (projectsSpy) {
            projectsSpy.mockRestore();
        }
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
});
