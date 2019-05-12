import { Button, Collapse, H5, Pre } from "@blueprintjs/core";
import React, { useCallback, useReducer } from "react";
import styled from "styled-components";
import { useJobs } from "../shared/Jobs";
import CommandOutput from "./CommandOutput";

const Container = styled.div``;

const CommandTitleActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > h5 {
        margin: 0 0 4px;
        max-width: 5rem;
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

function getJobData(state, room) {
    return (state[room] && state[room].stdout) || "";
}

const Command: React.FC<ICommandProps> = ({ command, socket, projectPath }) => {
    const [isOutputOpen, setOutputOpen] = React.useState(true);
    const [isRunning, setIsRunning] = React.useState(false);
    const [process, setProcess] = React.useState<any>(null);
    const room = command._id;
    const { state: jobState, dispatch, ACTION_TYPES } = useJobs();

    const updateJobOutput = useCallback(
        data => {
            dispatch({
                room,
                type: ACTION_TYPES.UPDATE_OUTPUT,
                data,
            });
        },
        [room],
    );

    const addJobToState = useCallback(() => {
        dispatch({
            type: ACTION_TYPES.ADD_JOB,
            room,
        });
    }, [room]);

    const clearJobOutput = useCallback(() => {
        dispatch({
            type: ACTION_TYPES.CLEAR_OUTPUT,
            room,
        });
    }, [room]);

    const initializeSocket = () => {
        // Check socket.on events for this room already initialized.
        // Otherwise, adds duplicate event listeners on switching tabs and coming back which makes duplicate joboutput
        // keys of jobState are registered rooms
        const currentRooms = Object.keys(jobState);
        if (currentRooms.indexOf(room) > -1) {
            console.info(`Room ${room} already exists. Skip initializing`);
            return;
        }

        console.info("Initializing room: ", room);
        addJobToState();
        socket.on(`job_started-${room}`, message => {
            console.info(`Job Started in room: ${room}`);
            setIsRunning(true);
            setProcess(message.data);
            updateJobOutput("");
        });
        socket.on(`output-${room}`, message => {
            if (room === message.room) {
                updateJobOutput(message.data);
            }
        });

        socket.on(`close-${room}`, message => {
            if (room === message.room) {
                console.info(`Process close in room: ${room}`);
                setIsRunning(false);
                updateJobOutput(message.data);
            }
        });

        socket.on(`error-${room}`, message => {
            if (room === message.room) {
                console.info(`Process error in room: ${room}`);
                setIsRunning(true);
                updateJobOutput(message.data);
            }
        });

        socket.on(`exit-${room}`, message => {
            if (room === message.room) {
                console.info(`Process exit in room: ${room}`);
                setIsRunning(false);
                updateJobOutput(message.data);
            }
        });

        socket.on(`job_killed-${room}`, message => {
            if (room === message.room) {
                console.info(`Process killed in room: ${room}; killed process id: ${message.data}`);
                setIsRunning(false);
                updateJobOutput("process with id " + message.data + " killed by user.");
            }
        });
    };

    React.useEffect(() => {
        initializeSocket();
    }, [room]);

    const startJob = () => {
        clearJobOutput();
        socket.emit("subscribe", {
            room,
            command,
            projectPath,
        });
    };

    const stopJob = () => {
        const { pid } = process;
        socket.emit("unsubscribe", {
            room: command._id,
            pid,
        });
    };

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
                        disabled={isRunning}
                        onClick={startJob}
                    />
                    <Button
                        data-testid="job-stop"
                        intent="danger"
                        icon="stop"
                        minimal={true}
                        disabled={!isRunning}
                        onClick={stopJob}
                    />
                </CommandTitleActions>
                <span>{command.cmd}</span>
                <Button onClick={() => setOutputOpen(!isOutputOpen)}>{isOutputOpen ? "Hide" : "Show"} Output</Button>
            </CommandHeader>
            <Collapse isOpen={isOutputOpen}>
                <CommandOutput output={getJobData(jobState, room) || "Process not running"} />
            </Collapse>
        </Container>
    );
};

export default Command;
