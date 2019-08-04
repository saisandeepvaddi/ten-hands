import React from "react";
import { render } from "@testing-library/react";
import { ConfigProvider } from "./components/shared/Config";
import { JobsProvider } from "./components/shared/Jobs";
import { ProjectsProvider } from "./components/shared/Projects";
import { ThemeProvider } from "./components/shared/Themes";

export const AllTheProviders = ({ children }) => {
  return (
    <ConfigProvider>
      <ThemeProvider>
        <ProjectsProvider>
          <JobsProvider>{children}</JobsProvider>
        </ProjectsProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

const customRender = (ui, options) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

export * from "@testing-library/react";

export { customRender as render };
