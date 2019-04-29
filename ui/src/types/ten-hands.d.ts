interface IMyTheme {
    readonly theme: string;
    setTheme: any;
}

interface IProjectCommand {
    [name: string]: string;
}

interface IProject {
    readonly id: string;
    readonly name: string;
    readonly type: string;
    readonly commands: IProjectCommand[];
}