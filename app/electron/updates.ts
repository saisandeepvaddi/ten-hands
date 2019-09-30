import Axios from "axios";
import { dialog, shell } from "electron";
import readPkg from "read-pkg";

interface IUpdate {
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
  currentVersion?
): Promise<null | IUpdate> => {
  const _appVersion = currentVersion || (await readPkg()).version;
  const appVersion = _appVersion.startsWith("v")
    ? _appVersion
    : "v" + _appVersion;
  const githubReleases = await Axios.get(
    "https://api.github.com/repos/saisandeepvaddi/ten-hands/releases"
  );
  const releaseDetails = githubReleases.data.map(release => {
    const { prerelease, published_at, tag_name } = release;
    return { prerelease, published_at, tag_name };
  });
  const currentVersionRelease = releaseDetails.find(
    release => release.tag_name.toLowerCase() === appVersion.toLowerCase()
  );

  if (!currentVersionRelease) {
    throw new Error(
      "Unable to find updates. Please check releases section of https://github.com/saisandeepvaddi/ten-hands"
    );
  }

  let latestVersion = currentVersionRelease;

  releaseDetails.forEach(release => {
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
