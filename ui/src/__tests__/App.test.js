import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import React from "react";
import { render, waitForElement } from "react-testing-library";
import App from "../components/App";
import { act } from "react-dom/test-utils";

jest.mock("../utils/api", () => {
  const projects = [
    {
      id: "1",
      name: "Mock Project 1",
      type: "node",
      configFile: "package.json",
      commands: [
        {
          start: "yarn start"
        },
        {
          dev: "yarn dev"
        },
        {
          test: "yarn test"
        }
      ]
    }
  ];

  return {
    getProjects: jest.fn(() => {
      return Promise.resolve(projects);
    })
  };
});

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

describe("App Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<App />);
    expect(container).not.toBeNull();
  });

  it("loads first project on screen", async () => {
    let { container, debug, queryByTestId } = render(<App />);
    const openedProject = await waitForElement(() =>
      queryByTestId("active-project-name")
    );
    expect(openedProject.textContent).toBe("Mock Project 1");
  });
});
