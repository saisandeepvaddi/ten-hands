interface IConfig {
  port: string | number;
  enableTerminalTheme?: boolean;
  globalHotKey?: string;
  showAppRunningTrayNotification?: boolean;
  showStatusBar?: boolean;
  taskViewStyle?: "tabs" | "rows";
  shell?: string;
  hideToTrayOnClose?: boolean;
  terminalRenderer?: "canvas" | "webgl";
  showTaskCountBadge?: boolean;
}
