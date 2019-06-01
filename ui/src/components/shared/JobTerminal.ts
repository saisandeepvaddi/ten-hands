import { Classes } from "@blueprintjs/core";
import { ITerminalOptions, ITheme, Terminal } from "xterm";

class JobTerminal {
    public _id: string;
    public isOpened: boolean = false;
    private terminal: Terminal;
    private options: ITerminalOptions = {
        cols: 100,
        rows: 20,
    };
    private darkTheme: ITheme = {
        background: "#202B33",
        foreground: "#F5F8FA",
        // black: "#182026",
        // blue: "#137CBD",
        // brightBlack: "#10161A",
        // brightBlue: "#0E5A8A",
        // brightCyan: "#97F3EB",
        // brightGreen: "#0A6640",
        // brightMagenta: "#FF66A1",
        // brightRed: "#DB3737",
        // brightWhite: "#FFFFFF",
        // brightYellow: "#FFC940",
        // cursor: "",
        // cursorAccent: "",
        // cyan: "#78D5CC",
        // green: "#0F9960",
        // magenta: "#A82255",
        // red: "#A82A2A",
        // selection: "#A7B6C2",
        // white: "#E1E8ED",
        // yellow: "#D99E0B",
    };
    private lightTheme: ITheme = {
        background: "#F5F8FA",
        foreground: "#10161A",
        // black: "#182026",
        // blue: "#137CBD",
        // brightBlack: "#10161A",
        // brightBlue: "#0E5A8A",
        // brightCyan: "#97F3EB",
        // brightGreen: "#0A6640",
        // brightMagenta: "#FF66A1",
        // brightRed: "#DB3737",
        // brightWhite: "#FFFFFF",
        // brightYellow: "#FFC940",
        // cursor: "",
        // cursorAccent: "",
        // cyan: "#78D5CC",
        // green: "#0F9960",
        // magenta: "#A82255",
        // red: "#A82A2A",
        // selection: "#A7B6C2",
        // white: "#E1E8ED",
        // yellow: "#D99E0B",
    };

    private _container: HTMLDivElement = document.createElement("div");

    constructor(_id: string) {
        this._id = _id;
        this.terminal = new Terminal(this.options);
    }

    public attachTo(container: HTMLDivElement) {
        this._container = container;
        this.terminal.open(container);
    }

    public setTheme(theme: string) {
        if (theme === Classes.DARK) {
            this.terminal.setOption("theme", this.darkTheme);
        } else {
            this.terminal.setOption("theme", this.lightTheme);
        }
    }

    public resizeTerminal(width: number) {
        this.terminal.resize(Math.floor(width / 10), this.options.rows!);
    }

    public updateOutput(stdout: string) {
        // Printing stdout as is making the output ugly with weird left paddings on each line
        // so remove lines and print each line with terminal.writeln
        const lines = stdout.split(/[\r\n]/);
        lines.forEach(line => {
            if (line) {
                this.terminal.write(line);
                console.log("line:", line);
                this.terminal.writeln("");
            }
        });
    }

    public clear() {
        this.terminal.clear();
    }

    public destroy() {
        console.log("Destroying");

        this.terminal.destroy();
    }
}

export default JobTerminal;
