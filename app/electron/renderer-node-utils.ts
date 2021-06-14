import path from "path";
const remote = require("electron");
export const uploadAndReadPackageJSON = () => {
  return new Promise((resolve, reject) => {
    try {
      remote.dialog
        .showOpenDialog({
          filters: [{ name: "package.json", extensions: ["json"] }],
        })
        .then(({ filePaths }: { filePaths: any }) => {
          const filePath: string | undefined =
            filePaths && filePaths.length > 0 ? filePaths[0] : undefined;
          if (filePath === undefined) {
            console.log("No file uploaded");
            return null;
          }
          require("fs").readFile(
            filePath,
            "utf-8",
            (err: any, fileData: any) => {
              if (err) {
                throw new Error("Error reading config file");
              }
              resolve({
                filePath,
                fileData,
              });
            },
          );
        });
    } catch (error) {
      console.log("error:", error);
      reject(error);
      return null;
    }
  });
};

export const createTenHandsConfigFile = (filePath: string, fileData: any) => {
  const fileName = path.basename(filePath);
  const projectPath = path.dirname(filePath);

  const tenHandsFile = {
    name: fileName,
    path: projectPath,
    data: fileData,
  };

  return tenHandsFile;
};

export const readUploadedConfigFile = async (filePath: string) => {
  return new Promise((resolve) => {
    require("fs").readFile(filePath, "utf8", (err: Error, fileData: any) => {
      if (err) {
        throw new Error("Error reading config file.");
      }

      const tenHandsFile = createTenHandsConfigFile(filePath, fileData);

      resolve(tenHandsFile);
    });
  });
};