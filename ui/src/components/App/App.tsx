import React from "react";
import { ReactQueryDevtools } from "react-query-devtools";
import { ThemeProvider } from "../shared/stores/ThemeStore";

// To disable no-submodule-imports, but tslint:disable:no-submodule-imports not working
// See https://stackoverflow.com/questions/54071852/tslint-always-enforcing-no-submodule-imports-rule-even-if-disabled
/* tslint:disable */
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
/* tslint:enable */

import { ConfigProvider } from "../shared/stores/ConfigStore";
import { JobsProvider } from "../shared/stores/JobStore";
import { ProjectsProvider } from "../shared/stores/ProjectStore";
import { SocketsProvider } from "../shared/stores/SocketStore";
import "./App.css";
import AppLayout from "./AppLayout";

const App = () => {
  return (
    <React.Fragment>
      <ConfigProvider>
        <ThemeProvider>
          <JobsProvider>
            <SocketsProvider>
              <ProjectsProvider>
                <AppLayout />
              </ProjectsProvider>
            </SocketsProvider>
          </JobsProvider>
        </ThemeProvider>
      </ConfigProvider>
      <ReactQueryDevtools />
    </React.Fragment>
  );
};

export default App;
