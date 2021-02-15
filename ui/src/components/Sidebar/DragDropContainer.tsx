import { Classes, Code, Colors, Icon } from "@blueprintjs/core";
import React, { ReactNodeArray, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getFileData } from "../App/dragDropProject";
import { useProjects } from "../shared/stores/ProjectStore";

import styled from "styled-components";
import { isRunningInElectron } from "../../utils/electron";
import { hasProjectWithSameName } from "../../utils/projects";
import { useTheme } from "../shared/stores/ThemeStore";
import { toaster } from "../shared/Toaster";

interface IDragDropContainerProps {
  children: ReactNodeArray;
}

const Container = styled.div`
  background: ${(props) =>
    props.theme === Classes.DARK ? Colors.DARK_GRAY2 : Colors.LIGHT_GRAY2};
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
`;

const DragDropContainer: React.FC<IDragDropContainerProps> = ({ children }) => {
  const { projects, addProject } = useProjects();
  const { theme } = useTheme();

  const handleProjectFileUpload = async (file) => {
    try {
      if (hasProjectWithSameName(projects, file.name)) {
        toaster.error(
          "Project exists with same name. You can use New Project button to upload file and change project name."
        );
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
    (acceptedFiles) => {
      const upload = async (files) => {
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
    [projects]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noDragEventsBubbling: true,
  });

  if (!isRunningInElectron()) {
    return (
      <Container theme={theme} className="file-drag-container h-100 w-100">
        {children}
      </Container>
    );
  }

  return (
    <Container
      theme={theme}
      className="file-drag-container"
      {...getRootProps({ className: "dropzone" })}
    >
      <div
        className="w-100 h-100"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {!isDragActive && children}
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="h-100 w-100 d-flex justify-center align-center truncate">
            Drop the files here ...
          </div>
        ) : (
          <div className="w-100 d-flex justify-center align-center">
            <span className="truncate">
              <Icon icon={"lightbulb"} intent="warning" /> Drop{" "}
              <Code>package.json</Code> here to add project.
            </span>
          </div>
        )}
      </div>
    </Container>
  );
};

export default DragDropContainer;
