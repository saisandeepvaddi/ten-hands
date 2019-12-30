import Axios from "axios";
import { dialog, shell, app } from "electron";
import readPkg from "read-pkg";
import { log } from "./logger";

const isDev = require("electron-is-dev");
interface IRelease {
  prerelease: boolean;
  published_at: Date;
  tag_name: string;
}

export const showUpdateAvailableMessage = () => {
  const response = dialog.showMessageBoxSync({
    type: "info",
    title: "Update Available",
    message: "An update available for Ten Hands. Do you want to download?",
    buttons: ["Yes, Get Update", "Cancel"]
  });

  if (response === 0) {
    shell.openExternalSync(
      "https://github.com/saisandeepvaddi/ten-hands/releases"
    );
  }
};

export const showUpdateNotAvailableMessage = () => {
  const response = dialog.showMessageBoxSync({
    type: "info",
    title: "Already up to date",
    message:
      "You are already running latest version of Ten Hands. You can check for any pre-releases in GitHub.",
    buttons: ["Go to GitHub", "Cancel"]
  });

  if (response === 0) {
    shell.openExternalSync(
      "https://github.com/saisandeepvaddi/ten-hands/releases"
    );
  }
};

export const showUnableToCheckUpdatesMessage = () => {
  const response = dialog.showMessageBoxSync({
    type: "error",
    title: "Unable to check for updates.",
    message:
      "Unable to check for updates now. Please visit GitHub page for checking manually.",
    buttons: ["Go to GitHub", "Cancel"]
  });

  if (response === 0) {
    shell.openExternalSync(
      "https://github.com/saisandeepvaddi/ten-hands/releases"
    );
  }
};

export const getAppUpdate = async (
  currentVersion = ""
): Promise<null | IRelease> => {
  const _appVersion =
    currentVersion || (isDev ? (await readPkg()).version : app.getVersion());
  const appVersion = _appVersion.startsWith("v")
    ? _appVersion
    : "v" + _appVersion;

  log.info("App Version: " + appVersion);

  const githubReleases = await Axios.get(
    "https://api.github.com/repos/saisandeepvaddi/ten-hands/releases"
  );

  const releaseDetails = githubReleases.data.map((release: IRelease) => {
    const { prerelease, published_at, tag_name } = release;
    return { prerelease, published_at, tag_name };
  });

  const currentVersionRelease = releaseDetails.find(
    (release: IRelease) =>
      release.tag_name.toLowerCase() === appVersion.toLowerCase()
  );

  if (!currentVersionRelease) {
    throw new Error(
      "Unable to find updates. Please check releases section of https://github.com/saisandeepvaddi/ten-hands"
    );
  }

  let latestVersion = currentVersionRelease;

  releaseDetails.forEach((release: IRelease) => {
    const { published_at } = release;
    if (
      new Date(published_at).getTime() >
      new Date(latestVersion.published_at).getTime()
    ) {
      latestVersion = { ...release };
    }
  });

  if (
    latestVersion.tag_name.toLowerCase() !==
    currentVersionRelease.tag_name.toLowerCase()
  ) {
    return latestVersion;
  }

  return null;
};
