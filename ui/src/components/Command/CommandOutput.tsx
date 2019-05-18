import { Pre } from "@blueprintjs/core";
import React from "react";

interface ICommandProps {
    output: string;
}

const CommandOutput: React.FC<ICommandProps> = React.memo(({ output }) => {
    return (
        <Pre
            className="command-output"
            style={{
                flex: 1,
                maxHeight: 250,
                overflow: "auto",
                display: "flex",
                flexDirection: "column-reverse",

                paddingTop: 10,
            }}
        >
            {output || "Process not running"}
        </Pre>
    );
});

export default CommandOutput;
