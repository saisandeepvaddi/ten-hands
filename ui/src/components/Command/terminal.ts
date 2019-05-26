import { Classes } from "@blueprintjs/core";
import { ITerminalOptions, ITheme, Terminal } from "xterm";
import { fit } from "xterm/lib/addons/fit/fit";

class JobTerminal {
    public _id: string;
    public isOpened: boolean = false;
    private terminal: Terminal;
    private options: ITerminalOptions;
    private darkTheme: ITheme = {
        background: "#202B33",
    };
    private lightTheme: ITheme = {
        background: "#F5F8FA",
        foreground: "#10161A",
    };

    constructor(_id: string) {
        this._id = _id;
        this.options = {
            rows: 20,
        };
        this.terminal = new Terminal(this.options);
    }

    public attachTo(container: HTMLDivElement) {
        this.terminal.open(container);
        // fit(this.terminal);
    }

    public setTheme(theme: string) {
        if (theme === Classes.DARK) {
            this.terminal.setOption("theme", this.darkTheme);
        } else {
            this.terminal.setOption("theme", this.lightTheme);
        }
    }

    public updateOutput(stdout: string) {
        this.terminal.writeln(stdout);
    }

    public clear() {
        this.terminal.clear();
    }

    public destroy() {
        console.log("Destroying");

        this.terminal.destroy();
    }
}

// tslint:disable-next-line: max-classes-per-file
class JobTerminalManager {
    public static getInstance() {
        if (!JobTerminalManager._instance) {
            JobTerminalManager._instance = new JobTerminalManager();
        }
        return this._instance;
    }
    private static _instance: JobTerminalManager;

    private _terminals: { [key: string]: JobTerminal } = {};

    public createJobTerminal(roomId: string): JobTerminal {
        let terminal = this.getTerminalForRoom(roomId);
        if (!terminal) {
            terminal = new JobTerminal(roomId);
            this._terminals[roomId] = terminal;
        }
        return terminal;
    }

    public updateOutputInRoom(roomId: string, output: string) {
        const terminal = this._terminals[roomId];
        if (terminal) {
            terminal.updateOutput(output);
        }
    }

    public clearTerminalInRoom(roomId: string) {
        const terminal = this._terminals[roomId];
        if (terminal) {
            terminal.clear();
        }
    }

    public getTerminalForRoom(roomId: string) {
        return this._terminals[roomId] || undefined;
    }
}

export { JobTerminal, JobTerminalManager };
