import { Terminal } from "xterm";

class JobTerminal {
    public isOpened: boolean = false;
    private terminal: any = null;
    constructor(container: HTMLDivElement) {
        this.terminal = new Terminal();
        this.terminal.open(container);
    }

    public updateOutput(stdout: string) {
        console.log("stdout:", stdout);
        this.terminal.write(stdout);
    }
}

export default JobTerminal;
