import React from "react";
import { render, cleanup } from "../../test-utils";
import AppLayout from "./AppLayout";
import { ConfigProvider } from "../shared/Config";

describe("AppLayout Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<AppLayout />);
    expect(container).not.toBeNull();
  });
});
