import { Classes } from "@blueprintjs/core";
import { ITerminalOptions, ITheme, Terminal } from "xterm";

class JobTerminal {
    public isOpened: boolean = false;
    private terminal: Terminal;
    private options: ITerminalOptions;
    private darkTheme: ITheme = {
        background: "#202B33",
    };
    private lightTheme: ITheme = {
        background: "#D8E1E8",
    };

    constructor(container: HTMLDivElement) {
        this.options = {
            rows: 20,
        };
        this.terminal = new Terminal(this.options);
        this.terminal.open(container);
    }

    public setTheme(theme: string) {
        if (theme === Classes.DARK) {
            this.terminal.setOption("theme", {
                background: "#202B33",
            });
        } else {
            this.terminal.setOption("theme", {
                background: "#BFCCD6",
                foreground: "#10161A",
            });
        }
    }

    public updateOutput(stdout: string) {
        this.terminal.writeln(stdout);
    }

    public destroy() {
        console.log("Destroying");

        this.terminal.destroy();
    }
}

export default JobTerminal;
