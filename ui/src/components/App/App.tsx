// To disable no-submodule-imports, but tslint:disable:no-submodule-imports not working
// See https://stackoverflow.com/questions/54071852/tslint-always-enforcing-no-submodule-imports-rule-even-if-disabled
/* tslint:disable */
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./App.css";

import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RecoilRoot } from "recoil";

import ErrorFallback from "../shared/ErrorFallback";
/* tslint:enable */
import { ConfigProvider } from "../shared/stores/ConfigStore";
import { JobsProvider } from "../shared/stores/JobStore";
import { ProjectsProvider } from "../shared/stores/ProjectStore";
import { SocketsProvider } from "../shared/stores/SocketStore";
import { ThemeProvider } from "../shared/stores/ThemeStore";
import AppLayout from "./AppLayout";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider>
            <ThemeProvider>
              <JobsProvider>
                <SocketsProvider>
                  <ProjectsProvider>
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <AppLayout />
                    </React.Suspense>
                  </ProjectsProvider>
                </SocketsProvider>
              </JobsProvider>
            </ThemeProvider>
          </ConfigProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </RecoilRoot>
    </ErrorBoundary>
  );
};

export default App;
