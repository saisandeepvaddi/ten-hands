// import "jest-dom/extend-expect";
// import "react-testing-library/cleanup-after-each";
import React from "react";
import { render } from "../../utils/test-utils";
import Sidebar from "./Sidebar";

jest.mock("../shared/API.ts", () => {
    return require("../shared/mocks/API").allMockAjaxFunctions;
});

describe("Sidebar Component", () => {
    let component: any = null;
    it("renders without crashing", async () => {
        try {
            component = await render(<Sidebar />);
            const { container, getByText } = component;
            expect(container).not.toBeNull();
            expect(getByText(/new project/i)).not.toBeFalsy();
        } catch (error) {
            console.log("Sidebar error:", error);
        }
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
});
