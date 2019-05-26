import { Pre } from "@blueprintjs/core";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useJobs } from "../shared/Jobs";
import { useTheme } from "../shared/Themes";
import { JobTerminal, JobTerminalManager } from "./terminal";

interface ICommandProps {
    room: string;
}

const TerminalContainer = styled.div`
    flex: 1;
    max-width: 100%;
    padding: 10px;
    white-space: pre-wrap;
`;

function getJobStdout(state, room: string) {
    return (
        state[room] || {
            stdout: "",
        }
    );
}

const CommandOutputXterm: React.FC<ICommandProps> = React.memo(({ room }) => {
    const elRef = React.useRef<HTMLDivElement>(null);
    const terminal = React.useRef<JobTerminal | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (elRef && elRef.current) {
            if (terminal.current === null) {
                terminal.current = JobTerminalManager.getInstance().createJobTerminal(room);
                terminal.current.attachTo(elRef.current);
                terminal.current.setTheme(theme);
            }
        }
    }, []);

    useEffect(() => {
        if (terminal && terminal.current) {
            terminal.current.setTheme(theme);
        }
    }, [theme]);

    return <TerminalContainer ref={elRef} />;
});

export default CommandOutputXterm;
