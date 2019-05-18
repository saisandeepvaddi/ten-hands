const fs = require("fs-extra");
const path = require("path");
const execa = require("execa");

const buildUI = async () => {
  try {
    const uiBuild = execa.shellSync("yarn build", {
      cwd: path.resolve(__dirname, "ui")
    });

    uiBuild.stdout.on("data", chunk => {
      console.log(chunk.toString());
    });

    return true;
  } catch (error) {
    console.log("error:", error);
  }
};

const buildElectron = async () => {
  try {
    const electronBuild = execa.shellSync("yarn build", {
      cwd: path.resolve(__dirname, "app")
    });

    electronBuild.stdout.on("data", chunk => {
      console.log(chunk.toString());
    });

    return true;
  } catch (error) {
    console.log("error:", error);
  }
};

const moveBuilds = async () => {
  try {
    await fs.move(
      path.resolve(__dirname, "ui", "build"),
      path.resolve(__dirname, "build"),
      { overwrite: true }
    );
    await fs.move(
      path.resolve(__dirname, "app", "build"),
      path.resolve(__dirname, "build"),
      { overwrite: true }
    );
  } catch (error) {
    console.log("error:", error);
  }
};

const startBuild = async () => {
  try {
    await buildUI();
    await buildElectron();
    await moveBuilds();
  } catch (error) {
    console.log("error:", error);
  }
};

startBuild();
