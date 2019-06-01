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
        this.terminal.write(stdout);
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
