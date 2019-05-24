import { Pre } from "@blueprintjs/core";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useJobs } from "../shared/Jobs";
import JobTerminal from "./terminal";

interface ICommandProps {
    room: string;
}

const TerminalContainer = styled.div`
    flex: 1;
    max-height: 250;
    overflow: auto;
`;

function getJobStdout(state, room: string) {
    return (
        state[room] || {
            stdout: "",
        }
    );
}

const CommandOutput: React.FC<ICommandProps> = React.memo(({ room }) => {
    const [terminal, setTerminal] = useState<JobTerminal | null>(null);
    const terminalContainerRef = React.createRef<HTMLDivElement>();
    const { state } = useJobs();
    useEffect(() => {
        const terminalElement = terminalContainerRef.current;
        if (terminalElement !== null) {
            const t = new JobTerminal(terminalElement);
            setTerminal(t);
            // t.openTerminal(terminalElement);
        }
    }, []);

    useEffect(() => {
        const output = getJobStdout(state, room).stdout;
        if (terminal) {
            terminal.updateOutput(output);
        }
    }, [terminal, state[room]]);
    console.log("Updating");

    return <TerminalContainer ref={terminalContainerRef} />;
});

export default CommandOutput;
