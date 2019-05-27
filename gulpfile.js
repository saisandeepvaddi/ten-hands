const { series, src, dest, parallel } = require("gulp");
const { task, exec, stream } = require("gulp-execa");
const del = require("del");
const path = require("path");
const through2 = require("through2");

/* BUILDING TASKS */

const buildUIForBrowser = task("yarn build:browser", {
  cwd: path.join(__dirname, "ui")
});

const buildUIForElectron = task("yarn build:electron", {
  cwd: path.join(__dirname, "ui")
});

const buildServerForElectron = task("yarn build", {
  cwd: path.join(__dirname, "app")
});

const buildDesktopAppInstallers = task("yarn build:installers", {
  cwd: path.join(__dirname, "app")
});

const buildCLI = task("yarn build", {
  cwd: path.join(__dirname, "cli")
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

const moveCLIBuildToFinalDist = async () => {
  return src(["./cli/build/**/*"]).pipe(dest("./dist/cli"));
};

/* Transformations */

const updateCLIPackageJson = async () => {
  return src("./cli/package.json")
    .pipe(
      through2.obj(function(file, _, cb) {
        if (file.isBuffer()) {
          const currentPackageJson = JSON.parse(file.contents.toString());

          const newPackageJson = Object.assign(currentPackageJson, {
            main: "index.js",
            scripts: {
              start: "node index.js"
            },
            bin: {
              "ten-hands": "index.js"
            }
          });

          file.contents = Buffer.from(JSON.stringify(newPackageJson));
        }
        cb(null, file);
      })
    )
    .pipe(dest("./dist/cli"));
};

const delay = time => {
  return async () => {
    return new Promise(resolve => {
      setTimeout(resolve, time);
    });
  };
};

exports.buildDesktop = series(
  parallel(cleanAppBuild, cleanAppDist, cleanDesktopFinalDist),
  parallel(buildUIForElectron, buildServerForElectron),
  moveUIBuilds,
  buildDesktopAppInstallers,
  moveDesktopBuildToFinalDist,
  delay(2000),
  cleanAppDist
);

exports.buildCLI = series(
  parallel(cleanCLIBuild, cleanCLIFinalDist),
  buildCLI,
  moveCLIBuildToFinalDist,
  updateCLIPackageJson
);
