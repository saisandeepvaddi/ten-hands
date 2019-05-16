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
    stdout?: string;
    state?: object;
    isRunning?: boolean;
    socketId?: string;
    process?: any;
}

interface IStateAction {
    type: ACTION_TYPES;
    state: object;
}

interface Window {
    tenHands: any;
}
