import { Button, Classes, Code, Colors, Icon } from "@blueprintjs/core";
import React, { useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
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
    const { projects, addProjectWithDrop } = useProjects();
    const _rememberProjectsForDrop = React.useRef<IProject[]>([]);

    React.useEffect(() => {
        // Drag & Drop did not remember the existing projects.
        // So save them temporarily and pass them later when project added with drag and drop.
        _rememberProjectsForDrop.current = [...projects];
    }, [projects]);

    const handleProjectFileUpload = async file => {
        try {
            await addProjectWithDrop(file, _rememberProjectsForDrop.current);
        } catch (error) {
            console.log("error:", error);
            console.error("Failed to add project.");
        }
    };

    const onDrop = useCallback(acceptedFiles => {
        const upload = async files => {
            // Do something with the files
            for (const file of files) {
                try {
                    const fileData = await getFileData(file);
                    await handleProjectFileUpload(fileData);
                } catch (error) {
                    console.log("error:", error);
                }
            }
        };

        upload(acceptedFiles);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        noClick: true,
    });

    return (
        <Container theme={theme} {...getRootProps()}>
            <Button
                data-testid="new-project-button"
                icon="add"
                intent="success"
                text="New Project"
                large={true}
                style={{ width: "100%" }}
                onClick={() => setDrawerOpen(true)}
            />

            <input {...getInputProps()} />
            {isDragActive ? (
                <div className="h-100 w-100 d-flex justify-center align-center">Drop the files here ...</div>
            ) : (
                <div className="h-100 w-100">
                    {projects.length > 0 && <ProjectsList />}
                    <div
                        className="w-100 d-flex justify-center align-center p-absolute"
                        style={{
                            bottom: 20,
                        }}
                    >
                        <span>
                            <Icon icon={"lightbulb"} intent="warning" /> Drop <Code>package.json</Code> here to add
                            project.
                        </span>
                    </div>
                </div>
            )}

            <NewProjectDrawer isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
        </Container>
    );
});

export default Sidebar;
