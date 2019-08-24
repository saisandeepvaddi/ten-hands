import { Button, Classes, Code, Colors, Icon } from "@blueprintjs/core";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { getFileData } from "../App/dragDropProject";
import NewProjectDrawer from "../NewProjectDrawer";
import ProjectsList from "../ProjectsList";
import { AppToaster } from "../shared/App";
import { useProjects } from "../shared/Projects";
import { useTheme } from "../shared/Themes";

const Container = styled.div`
    background: ${props => (props.theme === Classes.DARK ? Colors.DARK_GRAY2 : Colors.LIGHT_GRAY2)};
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
`;

const Sidebar = React.memo(() => {
    const { theme } = useTheme();
    const [isDrawerOpen, setDrawerOpen] = React.useState(false);
    const { projects, addProject } = useProjects();
    const dragContainer = useRef<HTMLDivElement>(null);

    const handleProjectFileUpload = async file => {
        try {
            await addProject(file);
        } catch (error) {
            console.log("error:", error);
            console.error("Failed to add project.");
        }
    };

    const handleFileDrop = async dragContainerElement => {
        try {
            dragContainerElement.addEventListener("dragover", function(e) {
                e.preventDefault();
                e.stopPropagation();
            });

            dragContainerElement.addEventListener("drop", async e => {
                e.preventDefault();
                e.stopPropagation();
                const files = Array.prototype.slice.call(e.dataTransfer!.files);
                for (const file of files) {
                    const fileData = await getFileData(file);
                    handleProjectFileUpload(fileData);
                }
            });
        } catch (error) {
            console.error("error:", error);
            if (error.message) {
                AppToaster.show({ message: error.message });
            }
            // Display error message here.
        }
    };

    useEffect(() => {
        const dragContainerElement = dragContainer.current;
        if (!dragContainerElement) {
            throw new Error("Drag Area not found.");
        }

        handleFileDrop(dragContainerElement);
    }, []);

    return (
        <Container theme={theme} ref={dragContainer}>
            <Button
                data-testid="new-project-button"
                icon="add"
                intent="success"
                text="New Project"
                large={true}
                style={{ width: "100%" }}
                onClick={() => setDrawerOpen(true)}
            />
            {projects.length > 0 && <ProjectsList />}
            <div
                className="w-100 d-flex justify-center align-center p-absolute"
                style={{
                    bottom: 20,
                }}
            >
                <span>
                    <Icon icon={"lightbulb"} intent="warning" /> Drop <Code>package.json</Code> here to add project.
                </span>
            </div>
            <NewProjectDrawer isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
        </Container>
    );
});

export default Sidebar;
