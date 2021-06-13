const { series, src, dest, parallel } = require("gulp");
const { task } = require("gulp-execa");
const del = require("del");
const path = require("path");
const through2 = require("through2");

/* DEV START TASKS */

const startUIForElectron = task("npm run start:desktop", {
  cwd: path.join(__dirname, "ui"),
});

const startUIForBrowser = task("npm run start:browser", {
  cwd: path.join(__dirname, "ui"),
});

const startBuildWatchForApp = task("npm run build:watch", {
  cwd: path.join(__dirname, "app"),
});

const startBuildWatchForCLI = task("npm run build:watch", {
  cwd: path.join(__dirname, "cli"),
});

const startAppsForDev = task("npm run dev", {
  cwd: path.join(__dirname, "app"),
});

const startServerForBrowser = task("npm run start:server", {
  cwd: path.join(__dirname, "app"),
});

exports.startUIForElectron = startUIForElectron;
exports.startUIForBrowser = startUIForBrowser;
exports.startBuildWatchForApp = startBuildWatchForApp;
exports.startAppsForDev = startAppsForDev;

/* BUILDING TASKS */

const buildUIForBrowser = task("npm run build:browser", {
  cwd: path.join(__dirname, "ui"),
});

const buildUIForElectron = task("npm run build:desktop", {
  cwd: path.join(__dirname, "ui"),
});

const buildServerForElectron = task("npm run build", {
  cwd: path.join(__dirname, "app"),
});

const buildDesktopAppInstallers = task("npm run build:installers", {
  cwd: path.join(__dirname, "app"),
});

const buildCLI = task("npm run build", {
  cwd: path.join(__dirname, "cli"),
});

/* VERSIONING TASKS */

const updateVersion = (type = "patch", where = "ui") =>
  task(`npm version ${type}`, {
    cwd: path.join(__dirname, where),
  });

/* CLEANING TASKS */

const cleanAppBuild = async () => {
  return await del(["./app/build/**/*", "!./app/build"]);
};

const cleanAppDist = async () => {
  return await del(["./app/dist/**/*", "!./app/dist"]);
};

const cleanDesktopFinalDist = async () => {
  return await del(["./dist/desktop/**/*", "!./dist/desktop"]);
};

const cleanCLIFinalDist = async () => {
  return await del(["./dist/cli/**/*", "!./dist/cli"]);
};

const cleanCLIBuild = async () => {
  return await del(["./cli/build/**/*", "!./cli/build"]);
};

/* MOVE BUILD FILES TO THEIR FINAL DESTINATIONS. */

const moveUIBuilds = async () => {
  // Electron-Builder runs in ./app folder, so move UI build there before building installer
  return src("./ui/build/**/*").pipe(dest("./app/build/ui"));
};

const moveDesktopBuildToFinalDist = async () => {
  return src("./app/dist/**/*").pipe(dest("./dist/desktop"));
};

const moveUIToCLI = async () => {
  return src("./ui/build/**/*").pipe(dest("./cli/build/server/public"));
};

const moveServerToCLI = async () => {
  return src("./app/build/server/**/*").pipe(dest("./cli/build/server"));
};

const moveServerConfigToCLI = async () => {
  return src("./app/build/shared/**/*").pipe(dest("./cli/build/shared"));
};

const moveCLIBuildToFinalDist = async () => {
  return src(["./cli/build/**/*", "./cli/README.md"]).pipe(dest("./dist/cli"));
};

const moveAppIconsToBuild = async () => {
  return src("./app/images/**/*").pipe(dest("./app/build"));
};

/* Transformations */

const updateCLIPackageJson = async () => {
  return src("./cli/package.json")
    .pipe(
      through2.obj(function (file, _, cb) {
        if (file.isBuffer()) {
          const currentPackageJson = JSON.parse(file.contents.toString());

          const newPackageJson = Object.assign(currentPackageJson, {
            main: "index.js",
            scripts: {
              start: "node index.js",
              postinstall: "node postinstall.js",
            },
            bin: {
              "ten-hands": "index.js",
            },
            files: [
              "server",
              "shared",
              "cli.js",
              "index.js",
              "postinstall.js",
              "server.js",
              "package.json",
              "README.md",
            ],
          });

          file.contents = Buffer.from(JSON.stringify(newPackageJson));
        }
        cb(null, file);
      }),
    )
    .pipe(dest("./dist/cli"));
};

const delay = (time) => {
  return async function wait() {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  };
};

/* DEV MODE TASKS */

// Keep startAppsForDev in parallel. react-scripts/rescripts start is stopping next tasks if put in series
// Just refresh (Ctrl + R) once to get fresh content once app starts in dev mode
exports.startDesktop = series(
  parallel(startUIForElectron, startBuildWatchForApp, startAppsForDev),
);

exports.startBrowser = series(
  parallel(startUIForBrowser, startBuildWatchForApp, startServerForBrowser),
);

exports.startServer = series(
  parallel(startBuildWatchForApp, startServerForBrowser),
);

exports.startCLI = series(startBuildWatchForCLI);

/* BUILD TASKS */
exports.buildDesktop = series(
  parallel(cleanAppBuild, cleanAppDist, cleanDesktopFinalDist),
  parallel(buildUIForElectron, buildServerForElectron),
  moveUIBuilds,
  moveAppIconsToBuild,
  buildDesktopAppInstallers,
  moveDesktopBuildToFinalDist,
  delay(5000),
  cleanAppDist,
);

exports.buildDesktopAzure = series(
  parallel(cleanAppBuild, cleanAppDist, cleanDesktopFinalDist),
  parallel(buildUIForElectron, buildServerForElectron),
  moveUIBuilds,
  moveAppIconsToBuild,
  buildDesktopAppInstallers,
  moveDesktopBuildToFinalDist,
);

exports.buildCLI = series(
  parallel(cleanAppBuild, cleanAppDist, cleanCLIBuild, cleanCLIFinalDist),
  parallel(buildUIForBrowser, buildServerForElectron),
  buildCLI,
  parallel(moveServerToCLI, moveServerConfigToCLI),
  delay(2000),
  moveUIToCLI,
  delay(2000),
  moveCLIBuildToFinalDist,
  updateCLIPackageJson,
);

exports.updateMajorVersion = parallel(
  updateVersion("major", "ui"),
  updateVersion("major", "app"),
  updateVersion("major", "cli"),
);

exports.updateMinorVersion = parallel(
  updateVersion("minor", "ui"),
  updateVersion("minor", "app"),
  updateVersion("minor", "cli"),
);

exports.updatePatchVersion = parallel(
  updateVersion("patch", "ui"),
  updateVersion("patch", "app"),
  updateVersion("patch", "cli"),
);
