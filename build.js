const fs = require("fs-extra");
const path = require("path");
const execa = require("execa");

const buildUI = async () => {
  return new Promise((resolve, reject) => {
    try {
      const uiBuild = execa("yarn build", {
        cwd: path.join(__dirname, "ui")
      });

      uiBuild.stdout.on("data", chunk => {
        console.log(chunk.toString());
      });

      uiBuild.stderr.on("data", chunk => {
        console.log(chunk.toString());
      });

      uiBuild.on("exit", chunk => {
        console.log(chunk.toString());
        resolve(true);
      });
    } catch (error) {
      console.log("error:", error);
      reject(new Error("UI Build Failed"));
    }
  });
};

const buildElectron = async () => {
  return new Promise((resolve, reject) => {
    try {
      const electronBuild = execa("yarn build", {
        cwd: path.join(__dirname, "app")
      });

      electronBuild.stdout.on("data", chunk => {
        console.log(chunk.toString());
      });

      electronBuild.stderr.on("data", chunk => {
        console.log(chunk.toString());
      });

      electronBuild.on("exit", chunk => {
        console.log(chunk.toString());
        resolve(true);
      });
    } catch (error) {
      console.log("error:", error);
      reject(new Error("Electron Build Failed"));
    }
  });
};

const moveBuilds = async () => {
  try {
    await fs.move(
      path.join(__dirname, "ui", "build"),
      path.join(__dirname, "app", "build", "ui"),
      { overwrite: true }
    );
  } catch (error) {
    console.log("error:", error);
  }
};

const buildInstaller = async () => {
  return new Promise((resolve, reject) => {
    try {
      const installerBuild = execa("yarn build:installer", {
        cwd: path.join(__dirname, "app")
      });

      installerBuild.stdout.on("data", chunk => {
        console.log(chunk.toString());
      });

      installerBuild.stderr.on("data", chunk => {
        console.log(chunk.toString());
      });

      installerBuild.on("exit", chunk => {
        console.log(chunk.toString());
        resolve(true);
      });
    } catch (error) {
      console.log("error:", error);
      reject(new Error("Installer Build Failed"));
    }
  });
};

const moveInstallers = async () => {
  try {
    await fs.move(
      path.join(__dirname, "app", "dist"),
      path.join(__dirname, "dist"),
      { overwrite: true }
    );
  } catch (error) {
    console.log("error:", error);
  }
};

const startBuild = async () => {
  try {
    console.log(`Building UI...`);
    await buildUI();
    console.log(`Building Electron...`);
    await buildElectron();
    console.log(`Moving Builds...`);
    await moveBuilds();
    console.log(`Building Installer...`);
    await buildInstaller();
    console.log(`Moving Installer for release...`);
    await moveInstallers();
  } catch (error) {
    console.log("error:", error);
  }
};

startBuild();
