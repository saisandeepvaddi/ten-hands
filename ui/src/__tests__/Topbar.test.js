import React from "react";
import Topbar from "../components/Topbar";
import { render } from "react-testing-library";

describe("Topbar Component", () => {
  it("renders without crashing", () => {
    const { container, getByText } = render(<Topbar />);
    expect(container).not.toBeNull();
    expect(getByText(/ten hands/i)).toBeTruthy();
  });
});
