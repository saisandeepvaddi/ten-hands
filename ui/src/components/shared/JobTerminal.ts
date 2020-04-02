import { Classes } from "@blueprintjs/core";
import { ITerminalOptions, ITheme, Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

// tslint:disable-next-line: no-submodule-imports
import "xterm/css/xterm.css";

class JobTerminal {
  public _id: string;
  public isOpened: boolean = false;
  private terminal: Terminal;
  private fitAddon: FitAddon;
  private options: ITerminalOptions = {
    convertEol: true
  };
  private darkTheme: ITheme = {
    background: "#202B33",
    foreground: "#F5F8FA"
  };
  private lightTheme: ITheme = {
    background: "#F5F8FA",
    foreground: "#000000",
    selection: "#73869480"
  };

  private _container: HTMLDivElement = document.createElement("div");

  constructor(_id: string) {
    this._id = _id;
    this.terminal = new Terminal(this.options);
    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);
  }

  public attachTo(container: HTMLDivElement) {
    this._container = container;
    this.terminal.open(container);
    this.fitAddon.fit();
  }

  public setTheme(theme: string) {
    if (theme === Classes.DARK) {
      this.terminal.setOption("theme", this.darkTheme);
    } else {
      this.terminal.setOption("theme", this.lightTheme);
    }
  }

  public getTheme() {
    return this.terminal.getOption("theme");
  }

  public removeTheme() {
    this.terminal.setOption("theme", {});
  }

  public resizeTerminal(width: number) {
    this.terminal.resize(Math.floor(width / 10), this.options.rows!);
  }

  public updateOutput(stdout: string) {
    this.terminal.write(stdout);
  }

  public clear() {
    this.terminal.clear();
  }

  public destroy() {
    this.terminal.dispose();
  }
}

export default JobTerminal;
