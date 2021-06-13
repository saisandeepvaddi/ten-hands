import { captureException } from "@sentry/react";

import handleConfigFiles from "../NewProjectDrawer/handleConfigFiles";

const checkIsFileValid = (file) => {
  const { name, size, type, path } = file;
  if (!path) {
    return {
      isValid: false,
      reason: "Invalid file path.",
    };
  }
  if (name.toLowerCase() !== "package.json" || type !== "application/json") {
    return {
      isValid: false,
      reason:
        "Currently only package.json is accepted as a config file. You can create a project and add custom tasks manually.",
    };
  }

  if (size <= 0) {
    return {
      isValid: false,
      reason: "Empty or invalid file found.",
    };
  }

  return { isValid: true };
};

// const getUploadableFile = async (tenHandsFile: ITenHandsFile) => {
//   const uploadableFile = handleConfigFiles(tenHandsFile);
//   return uploadableFile;
// };

export const getFileData = async (file) => {
  try {
    const validityCheck = checkIsFileValid(file);
    if (!validityCheck.isValid) {
      throw new Error(validityCheck.reason);
    }

    const tenHandsFile = await window.desktop.readUploadedConfigFile(file.path);
    const uploadableFile = handleConfigFiles(tenHandsFile);
    return uploadableFile;
  } catch (error) {
    console.error("error: ", error);
    captureException(error);
    throw error;
  }
  // return new Promise((resolve, reject) => {
  //   try {
  //     const validityCheck = checkIsFileValid(file);
  //     if (!validityCheck.isValid) {
  //       throw new Error(validityCheck.reason);
  //     }

  //     const { path } = file;

  //     require("fs").readFile(path, "utf8", (err, fileData) => {
  //       if (err) {
  //         throw new Error("Error reading config file.");
  //       }
  //       const uploadableFileData = getUploadableFile(path, fileData);
  //       resolve(uploadableFileData);
  //     });
  //   } catch (error) {
  //     console.log("error:", error);
  //     captureException(error);
  //     reject(error.message);
  //   }
  // });
};

export const getDraggedFiles = (dragContainer) => {
  return new Promise((resolve) => {
    dragContainer.addEventListener("dragover", function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    dragContainer.addEventListener("drop", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const files = Array.prototype.slice.call(e.dataTransfer?.files);
      resolve(files);
    });
  });
};
