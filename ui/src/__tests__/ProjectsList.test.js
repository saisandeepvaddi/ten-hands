import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import React from "react";
import { render, wait, waitForElement, fireEvent } from "react-testing-library";
import ProjectsList from "../components/ProjectsList/ProjectsList";

const projects = [
  {
    id: "1",
    name: "Project 1",
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
  },
  {
    id: "2",
    name: "Project 2",
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
    const { container } = render(
      <ProjectsList projects={projects} setActiveProject={jest.fn()} />
    );
    expect(container).not.toBeNull();
  });
});
