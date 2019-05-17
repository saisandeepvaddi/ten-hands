import { Button, Collapse, H5 } from "@blueprintjs/core";
import React from "react";
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

function getJobData(state, room: string) {
    return state[room] || "";
}

const Command: React.FC<ICommandProps> = React.memo(({ command, socket, projectPath }) => {
    const [isOutputOpen, setOutputOpen] = React.useState(true);

    const room = command._id;
    const { state: jobState, dispatch, ACTION_TYPES } = useJobs();

    // const updateJob = (room, stdout, isRunning) => {
    //     dispatch({
    //         room,
    //         type: ACTION_TYPES.UPDATE_JOB,
    //         stdout,
    //         isRunning,
    //     });
    // };

    // const addJobToState = room => {
    //     dispatch({
    //         type: ACTION_TYPES.ADD_JOB,
    //         room,
    //     });
    // };

    React.useEffect(() => {
        console.log("jobState: ", jobState);
    }, [jobState]);

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

    // const initializeSocket = async () => {
    //     // Check socket.on events for this room already initialized.
    //     // Otherwise, adds duplicate event listeners on switching tabs and coming back which makes duplicate joboutput
    //     // keys of jobState are registered rooms

    //     const currentRooms = Object.keys(jobState);

    //     if (currentRooms.indexOf(room) > -1) {
    //         console.info(`Room ${room} already exists. Skip initializing`);
    //         return;
    //     }

    //     addJobToState(room);
    //     socket.on(`job_started-${room}`, message => {
    //         console.info(`Job Started in room: ${room}`);
    //         // setProcess(message.data);
    //         // updateJob("", true);
    //         updateJobProcess(room, message.data);
    //     });
    //     socket.on(`output-${room}`, message => {
    //         if (room === message.room) {
    //             updateJob(room, message.data, true);
    //         }
    //     });

    //     socket.on(`close-${room}`, message => {
    //         if (room === message.room) {
    //             console.info(`Process close in room: ${room}`);
    //             updateJob(room, message.data, false);
    //         }
    //     });

    //     socket.on(`error-${room}`, message => {
    //         if (room === message.room) {
    //             console.info(`Process error in room: ${room}`);
    //             updateJob(room, message.data, false);
    //         }
    //     });

    //     socket.on(`exit-${room}`, message => {
    //         if (room === message.room) {
    //             console.info(`Process exit in room: ${room}`);
    //             updateJob(room, message.data, false);
    //         }
    //     });

    //     socket.on(`job_killed-${room}`, message => {
    //         if (room === message.room) {
    //             console.info(`Process killed in room: ${room}; killed process id: ${message.data}`);
    //             updateJob(room, "process with id " + message.data + " killed by user.", false);
    //         }
    //     });
    // };

    // React.useEffect(() => {
    //     initializeSocket();
    // }, []);

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
            <Collapse isOpen={isOutputOpen}>
                <CommandOutput output={getJobData(jobState, room).stdout || "Process not running"} />
            </Collapse>
        </Container>
    );
});

export default Command;
