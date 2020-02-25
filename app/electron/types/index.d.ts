interface IConfig {
  port: string | number;
  enableTerminalTheme?: boolean;
  globalHotKey?: string;
  showAppRunningTrayNotification?: boolean;
  showStatusBar?: boolean;

  taskViewStyle?: "tabs" | "rows";
}
