import { Button, Collapse, H5 } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import { useJobs } from "../shared/Jobs";
import CommandOutput from "./CommandOutput";

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const CommandTitleActions = styled.div`
    display: flex;
    max-width: 100%;
    justify-content: space-between;
    align-items: center;

    & > h5 {
        margin: 0 0 4px;
    }
    & > * {
        margin-left: 1rem;
    }
`;

const CommandHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

interface ICommandProps {
    command: IProjectCommand;
    socket: any;
    projectPath: string;
}

function getJobData(state, room: string) {
    return state[room] || "";
}

const Command: React.FC<ICommandProps> = React.memo(({ command, socket, projectPath }) => {
    const [isOutputOpen, setOutputOpen] = React.useState(true);

    const room = command._id;
    const { state: jobState, dispatch, ACTION_TYPES } = useJobs();

    const updateJobProcess = (room, jobProcess) => {
        dispatch({
            room,
            type: ACTION_TYPES.UPDATE_JOB_PROCESS,
            process: jobProcess,
        });
    };

    const clearJobOutput = room => {
        dispatch({
            type: ACTION_TYPES.CLEAR_OUTPUT,
            room,
        });
    };

    const startJob = () => {
        clearJobOutput(room);
        socket.emit("subscribe", {
            room,
            command,
            projectPath,
        });
    };

    const stopJob = () => {
        const process = getJobData(jobState, room).process;
        const { pid } = process;

        socket.emit("unsubscribe", {
            room: command._id,
            pid,
        });
        updateJobProcess(room, {
            pid: -1,
        });
    };

    const isProcessRunning = (): boolean => {
        return getJobData(jobState, room).isRunning || false;
    };

    // console.log(`updating: ${room}`);

    return (
        <Container>
            <CommandHeader>
                <CommandTitleActions>
                    <H5>{command.name}</H5>
                    <Button
                        data-testid="job-start"
                        icon="play"
                        intent="success"
                        minimal={true}
                        disabled={isProcessRunning()}
                        onClick={startJob}
                    />
                    <Button
                        data-testid="job-stop"
                        intent="danger"
                        icon="stop"
                        minimal={true}
                        disabled={!isProcessRunning()}
                        onClick={stopJob}
                    />
                </CommandTitleActions>
                <span>{command.cmd}</span>
                <Button onClick={() => setOutputOpen(!isOutputOpen)}>{isOutputOpen ? "Hide" : "Show"} Output</Button>
            </CommandHeader>
            <Collapse isOpen={isOutputOpen} keepChildrenMounted={true}>
                <CommandOutput output={getJobData(jobState, room).stdout || "Process not running"} />
            </Collapse>
        </Container>
    );
});

export default Command;
