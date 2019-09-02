import { Alert, Classes, Code, Colors, Icon } from "@blueprintjs/core";
import React, { ReactNodeArray, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getFileData } from "../App/dragDropProject";
import { useProjects } from "../shared/Projects";

import styled from "styled-components";
import { hasProjectWithSameName } from "../../utils/projects";
import { useTheme } from "../shared/Themes";

interface IDragDropContainerProps {
    children: ReactNodeArray;
}

const Container = styled.div`
    background: ${props => (props.theme === Classes.DARK ? Colors.DARK_GRAY2 : Colors.LIGHT_GRAY2)};
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
`;

const DragDropContainer: React.FC<IDragDropContainerProps> = ({ children }) => {
    const { projects, addProject } = useProjects();
    const { theme } = useTheme();

    const handleProjectFileUpload = async file => {
        try {
            if (hasProjectWithSameName(projects, file.name)) {
                const answer = window.confirm(
                    "Project with same name already exists. Do you want to add project anyway?",
                );
                if (answer) {
                    await addProject(file);
                } else {
                    console.log("Cancelled by user");
                }
            } else {
                await addProject(file);
            }
        } catch (error) {
            console.log("error:", error);
            console.error("Failed to add project.");
        }
    };

    /* eslint-disable react-hooks/exhaustive-deps */
    const onDrop = useCallback(
        acceptedFiles => {
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
        },
        [projects],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        noClick: true,
    });

    return (
        <>
            <Container theme={theme} className="file-drag-container h-100 w-100" {...getRootProps()}>
                {children}
                <input {...getInputProps()} />
                {isDragActive ? (
                    <div className="h-100 w-100 d-flex justify-center align-center">Drop the files here ...</div>
                ) : (
                    <div className="h-100 w-100">
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
            </Container>
        </>
    );
};

export default DragDropContainer;
