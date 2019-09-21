export const isRunningInElectron = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf(" electron/") > -1;
};

export const openInExplorer = projectPath => {
    const { shell } = require("electron");
    shell.openItem(projectPath);
};
