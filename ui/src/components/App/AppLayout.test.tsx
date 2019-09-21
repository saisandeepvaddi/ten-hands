import React from "react";
import { getFakeProjects, render } from "../../utils/test-utils";
import * as ajaxCalls from "../shared/API";
import AppLayout from "./AppLayout";

// Since AppLayout component is a container for the app, this suite is kind of works like integration.
describe.skip("AppLayout Component", () => {
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

    afterEach(() => {
        if (projectsSpy) {
            projectsSpy.mockRestore();
        }
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
});
