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
            rows: 25,
            // theme: localStorage.getItem("theme") === Classes.DARK ? this.darkTheme : this.lightTheme,
        };
        this.terminal = new Terminal(this.options);
        this.terminal.open(container);
    }

    public updateOutput(stdout: string) {
        console.log("stdout:", stdout);
        this.terminal.writeln(stdout);
    }

    public destroy() {
        console.log("Destroying");

        this.terminal.destroy();
    }
}

export default JobTerminal;
