import "jest-dom/extend-expect";
import React from "react";
import { render } from "react-testing-library";
import App from "../components/App";

describe("App Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<App />);
    expect(container).not.toBeNull();
  });
});
