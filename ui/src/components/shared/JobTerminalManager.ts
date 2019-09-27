import JobTerminal from "./JobTerminal";

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

export default JobTerminalManager;
