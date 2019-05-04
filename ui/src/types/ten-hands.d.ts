interface IMyTheme {
    readonly theme: string;
    setTheme: any;
}

interface IProjectCommand {
    [name: string]: string;
}

interface IProject {
    readonly _id?: string;
    readonly name: string;
    readonly type: string;
    readonly path?: string;
    readonly commands: IProjectCommand[];
}
