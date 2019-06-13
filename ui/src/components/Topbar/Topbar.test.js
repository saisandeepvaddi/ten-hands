import React from "react";
import { render, fireEvent } from "../../test-utils";
import Topbar from "./Topbar";
import App from "../App";

describe("Topbar Component", () => {
  test("renders without crashing", () => {
    const { container } = render(<Topbar />);
    expect(container).not.toBeNull();
  });

  test("should display Ten Hands title", () => {
    // Just to make sure topbar rendered correctly again
    const { getByText } = render(<Topbar />);
    expect(getByText(/ten hands/i)).not.toBeNull();
  });

  test("should change theme on Theme change button", async () => {
    const {
      findByTestId,
      getByTestId,
      queryByTestId,
      getAllByTestId,
      debug
    } = render(<Topbar />);

    expect(queryByTestId("theme-light")).not.toBeNull();
    expect(queryByTestId("theme-dark")).toBeNull();
    fireEvent.click(getByTestId("theme-light"));
    expect(queryByTestId("theme-light")).toBeNull();
    expect(queryByTestId("theme-dark")).not.toBeNull();

    // If theme is switched to light, there will be atleast one element with light class
    // There won't be .bp3-dark

    const { container, rerender } = render(<App />);
    const elementsWithLightClass = container.querySelectorAll(".light");
    expect(elementsWithLightClass.length).toBeGreaterThan(0);
    const elementsWithDarkClass = container.querySelectorAll(".bp3-dark");
    expect(elementsWithDarkClass.length).toBe(0);
  });
});
