import { Pre } from "@blueprintjs/core";
import React from "react";

interface ICommandProps {
    output: string;
}

const CommandOutput: React.FC<ICommandProps> = React.memo(({ output }) => {
    return <Pre>{output || "Process not running"}</Pre>;
});

export default CommandOutput;
