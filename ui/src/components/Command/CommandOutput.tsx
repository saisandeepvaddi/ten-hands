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

const CommandOutput: React.FC<ICommandProps> = ({ room }) => {
    const elRef = React.useRef<HTMLDivElement>(null);
    const terminal = React.useRef<JobTerminal | null>(null);
    const { state } = useJobs();
    useEffect(() => {
        if (elRef && elRef.current) {
            if (terminal.current === null) {
                terminal.current = new JobTerminal(elRef.current);
            }
        }
        return () => {
            if (terminal.current) {
                terminal.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        const output = getJobStdout(state, room).stdout || "";
        if (terminal.current) {
            terminal.current.updateOutput(output);
        }
    }, [room, state]);

    return <TerminalContainer ref={elRef} />;
};

export default CommandOutput;
