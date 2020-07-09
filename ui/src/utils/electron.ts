export const isRunningInElectron = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    userAgent.indexOf(" electron/") > -1 && userAgent.indexOf("cypress") === -1
  );
};

export const openInExplorer = (projectPath) => {
  const { shell } = require("electron");
  shell.openPath(projectPath);
};
