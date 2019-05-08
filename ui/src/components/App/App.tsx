import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import React from "react";
import { ThemeProvider } from "../shared/Themes";

import { ProjectsProvider } from "../shared/Projects";
import "./App.css";
import AppLayout from "./AppLayout";

const App = () => {
    return (
        <ThemeProvider>
            <ProjectsProvider>
                <AppLayout />
            </ProjectsProvider>
        </ThemeProvider>
    );
};

export default App;
