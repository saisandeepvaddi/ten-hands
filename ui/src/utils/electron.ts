export const isRunningInElectron = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf(" electron/") > -1;
};
