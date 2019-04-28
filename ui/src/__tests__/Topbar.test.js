import React from "react";
import Topbar from "../components/Topbar";
import { render } from "react-testing-library";

describe("Topbar Component", () => {
  it("renders without crashing", () => {
    const { container, getByText } = render(<Topbar />);
    expect(container).not.toBeNull();
    expect(getByText(/ten hands/i)).toBeTruthy();
  });

  it("changes theme on theme change button", async () => {
    const { queryByTestId, rerender } = render(
      <Topbar theme="bp3-light" setTheme={() => {}} />
    );
    expect(queryByTestId("theme-dark")).toBeInTheDocument();
    rerender(<Topbar theme="bp3-dark" setTheme={() => {}} />);
    expect(queryByTestId("theme-dark")).not.toBeInTheDocument();
    expect(queryByTestId("theme-light")).toBeInTheDocument();
  });
});
