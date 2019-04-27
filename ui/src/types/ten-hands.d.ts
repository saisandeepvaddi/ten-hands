interface IMyTheme {
  readonly theme: string;
  setTheme: any;
}

interface IProject {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly commands: Array<{
    [key: string]: string;
  }>;
}
