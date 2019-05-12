interface IMyTheme {
    theme: string;
    setTheme: any;
}

interface IProjectCommand {
    [name: string]: string;
}

interface IProject {
    _id?: string;
    name: string;
    type: string;
    path: string;
    configFile?: string;
    commands: IProjectCommand[];
}

interface IJobAction {
    room: string;
    type: ACTION_TYPES;
    data?: string;
}
