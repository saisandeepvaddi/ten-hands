import React from "react";
import { ButtonGroup, AnchorButton, Button, Popover } from "@blueprintjs/core";

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

const getButtonsOrder = () => {
  const os = getOS();

  let windows = {
    icon: <DiWindows size="1.5em" />,
    name: "Windows",
    link:
      "https://github.com/saisandeepvaddi/ten-hands/releases/download/v2.0.0-alpha.0/Ten.Hands.Setup.2.0.0-alpha.0.exe",
  };

  let macos = {
    icon: <DiApple size="1.5em" />,
    name: "macOS",
    link:
      "https://github.com/saisandeepvaddi/ten-hands/releases/download/v2.0.0-alpha.0/Ten.Hands-2.0.0-alpha.0.dmg",
  };

  let linux = {
    icon: <DiLinux size="1.5em" />,
    name: "Linux",
    link:
      "https://github.com/saisandeepvaddi/ten-hands/releases/download/v2.0.0-alpha.0/ten-hands-app_2.0.0-alpha.0_amd64.deb",
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

function ExtraDownloads() {
  const buttonsOrder = getButtonsOrder();
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
  const buttonsOrder = getButtonsOrder();
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
        <Popover content={<ExtraDownloads />} position="bottom">
          <Button intent="success" rightIcon="caret-down" />
        </Popover>
      </ButtonGroup>
    </>
  );
}

export default DownloadButton;
