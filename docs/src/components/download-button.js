import React, { useEffect } from "react";
import { ButtonGroup, AnchorButton, Button, Popover } from "@blueprintjs/core";
import axios from "axios";
import { DiApple, DiWindows, DiLinux } from "react-icons/di";

const getOS = () => {
  let os = "windows";
  if (typeof window !== "undefined") {
    if (window.navigator.appVersion.indexOf("Win") !== -1) os = "windows";
    if (window.navigator.appVersion.indexOf("Mac") !== -1) os = "macos";
    if (window.navigator.appVersion.indexOf("Linux") !== -1) os = "linux";
  }
  return os;
};

const getLatestReleases = async () => {
  const url = `https://api.github.com/repos/saisandeepvaddi/ten-hands/releases/latest`;
  const { data } = await axios.get(url);
  const defaultLink = "https://github.com/saisandeepvaddi/ten-hands/releases";
  const { assets } = data;
  let releases = {
    windows: defaultLink,
    linux: defaultLink,
    macos: defaultLink,
  };

  assets.forEach(({ browser_download_url }) => {
    if (browser_download_url.endsWith("exe")) {
      releases.windows = browser_download_url;
    } else if (browser_download_url.endsWith("deb")) {
      releases.linux = browser_download_url;
    } else if (browser_download_url.endsWith("dmg")) {
      releases.macos = browser_download_url;
    }
  });

  return releases;
};

const getButtonsOrder = async () => {
  const os = getOS();
  const latestReleases = await getLatestReleases();

  let windows = {
    icon: <DiWindows size="1.5em" />,
    name: "Windows",
    link: latestReleases.windows,
  };

  let macos = {
    icon: <DiApple size="1.5em" />,
    name: "macOS",
    link: latestReleases.macos,
  };

  let linux = {
    icon: <DiLinux size="1.5em" />,
    name: "Linux",
    link: latestReleases.linux,
  };

  let list = {
    windows,
    macos,
    linux,
  };

  const order = {
    windows: ["windows", "macos", "linux"],
    macos: ["macos", "windows", "linux"],
    linux: ["linux", "windows", "macos"],
  };

  return !os ? windows : order[os].map(o => list[o]);
};

function ExtraDownloads({ buttonsOrder }) {
  if (!buttonsOrder) return null;
  return (
    <>
      <div>
        <AnchorButton
          large
          className="w-100 d-flex justify-between"
          style={{ padding: 15 }}
          icon={buttonsOrder[1].icon}
          minimal
          href={buttonsOrder[1].link}
        >
          <span>{buttonsOrder[1].name}</span>
        </AnchorButton>
      </div>
      <div>
        <AnchorButton
          large
          className="w-100"
          style={{ padding: 15 }}
          icon={buttonsOrder[2].icon}
          minimal
          href={buttonsOrder[2].link}
        >
          {buttonsOrder[2].name}
        </AnchorButton>
      </div>
    </>
  );
}

function DownloadButton() {
  const [buttonsOrder, setButtonsOrder] = React.useState(null);

  useEffect(() => {
    (async function getDownloadLinks() {
      const buttonsOrder = await getButtonsOrder();
      setButtonsOrder(buttonsOrder);
    })();
  }, []);

  if (!buttonsOrder) return null;

  return (
    <>
      <ButtonGroup>
        <AnchorButton
          large
          intent="success"
          href={buttonsOrder[0].link}
          icon={buttonsOrder[0].icon}
        >
          Download for {buttonsOrder[0].name}
        </AnchorButton>
        <Popover
          content={<ExtraDownloads buttonsOrder={buttonsOrder} />}
          position="bottom"
        >
          <Button intent="success" rightIcon="caret-down" />
        </Popover>
      </ButtonGroup>
    </>
  );
}

export default DownloadButton;
