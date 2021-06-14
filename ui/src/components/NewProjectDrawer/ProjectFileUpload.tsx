import { Button } from "@blueprintjs/core";
import { captureException } from "@sentry/react";
import React from "react";
import styled from "styled-components";

import { isRunningInElectron } from "../../utils/electron";

const ProjectFileFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface IProjectFileUploadProps {
  configFileName?: string;
  onConfigFileUpload: (fileName: string, data: any) => void;
}

const ProjectFileUpload: React.FC<IProjectFileUploadProps> = React.memo(
  ({ configFileName, onConfigFileUpload }) => {
    const openUploadDialog = async () => {
      if (isRunningInElectron()) {
        try {
          const { fileData, filePath } =
            await window.desktop.uploadAndReadPackageJSON();
          onConfigFileUpload(filePath, fileData);

          // const { dialog } = require("electron").remote;
          // dialog
          //   .showOpenDialog({
          //     filters: [{ name: "package.json", extensions: ["json"] }],
          //   })
          //   .then(({ filePaths }) => {
          //     const configFilePath: string | undefined =
          //       filePaths && filePaths.length > 0 ? filePaths[0] : undefined;
          //     if (configFilePath === undefined) {
          //       console.log("No file uploaded");
          //       return null;
          //     }
          //     require("fs").readFile(
          //       configFilePath,
          //       "utf-8",
          //       (err, fileData) => {
          //         if (err) {
          //           throw new Error("Error reading config file");
          //         }
          //         onConfigFileUpload(configFilePath, fileData);
          //       }
          //     );
          //   });
        } catch (error) {
          console.log("error:", error);
          captureException(error);
          return null;
        }
      }
    };

    return (
      <ProjectFileFieldContainer>
        {configFileName ? <p>{configFileName}</p> : null}

        <Button
          text="Upload project file"
          icon="upload"
          intent="primary"
          onClick={openUploadDialog}
        />
      </ProjectFileFieldContainer>
    );
  },
);

export default ProjectFileUpload;
