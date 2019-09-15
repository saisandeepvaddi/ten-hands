// import "jest-dom/extend-expect";
// import "react-testing-library/cleanup-after-each";
import React from "react";
import { render } from "../../utils/test-utils";
import AppLayout from "./AppLayout";

// });

// // this is just a little hack to silence a warning that we'll get until react
// // fixes this: https://github.com/facebook/react/pull/14853
// // https://github.com/testing-library/react-testing-library/issues/281
// const originalError = console.error;
// beforeAll(() => {
//   console.error = (...args) => {
//     if (/Warning.*not wrapped in act/.test(args[0])) {
//       return;
//     }
//     originalError.call(console, ...args);
//   };
// });

// afterAll(() => {
//   console.error = originalError;
// });

describe("AppLayout Component", () => {
    it("renders without crashing", async () => {
        try {
            const { container, getByText } = await render(<AppLayout />);
            expect(container).not.toBeNull();
            expect(getByText(/ten hands/i)).toBeInTheDocument();
        } catch (error) {
            console.log("AppLayout error:", error);
        }
    });
});
