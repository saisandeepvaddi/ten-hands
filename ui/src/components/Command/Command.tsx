import { Button, Collapse, H5, Pre } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";

import JobSocket from "../../utils/socket";

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
}

interface IState {
    isOutputOpen: boolean;
    socket: any;
    jobOutput: string;
    process: any;
    room: string;
    isRunning: boolean;
}

const Command: React.FC<ICommandProps> = React.memo(({ command }) => {
    const [isOutputOpen, setOutputOpen] = React.useState(true);
    const [isRunning, setIsRunning] = React.useState(false);
    const [socket, setSocket] = React.useState(null);
    const [jobOutput, setJobOutput] = React.useState("");
    const [process, setProcess] = React.useState<any>(null);
    const [room, setRoom] = React.useState("");

    React.useEffect(() => {
        const socket = JobSocket.getSocket();
        setRoom(command._id);
        setSocket(socket);
        socket.on(`joined_room-${room}`, message => {
            if (room === message.room) {
                console.info(message.data);
            }
        });
        socket.on(`job_started-${room}`, message => {
            console.info(`Job Started in room: ${room}`);
            setIsRunning(true);
            setProcess(message.data);
            setJobOutput("");
        });
        socket.on(`output-${room}`, message => {
            if (room === message.room) {
                setJobOutput(jobOutput + message.data);
            }
        });

        socket.on(`close-${room}`, message => {
            if (room === message.room) {
                console.info(`Process close in room: ${room}`);
                setIsRunning(false);
                setJobOutput(jobOutput + message.data);
            }
        });

        socket.on(`error-${room}`, message => {
            if (room === message.room) {
                console.info(`Process error in room: ${room}`);
                setIsRunning(true);
                setJobOutput(jobOutput + message.data);
            }
        });

        socket.on(`exit-${room}`, message => {
            if (room === message.room) {
                console.info(`Process exit in room: ${room}`);
                setIsRunning(false);
                setJobOutput(jobOutput + message.data);
            }
        });

        socket.on(`job_killed-${room}`, message => {
            if (room === message.room) {
                console.info(`Process killed in room: ${room}; killed process id: ${message.data}`);
                setIsRunning(false);
                setJobOutput(jobOutput + "process with id " + message.data + " killed by user.");
            }
        });
    }, [command._id]);

    const startJob = socket => {
        const room = command._id;
        const job = command.cmd;
        socket.emit("subscribe", {
            room,
            job,
        });
    };

    const stopJob = socket => {
        const { pid } = process;
        socket.emit("unsubscribe", {
            room: command._id,
            job: command.cmd,
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
                        onClick={() => startJob(socket)}
                    />
                    <Button
                        data-testid="job-stop"
                        intent="danger"
                        icon="stop"
                        minimal={true}
                        disabled={!isRunning}
                        onClick={() => stopJob(socket)}
                    />
                </CommandTitleActions>
                <span>{command.command}</span>
                <Button onClick={() => setOutputOpen(!isOutputOpen)}>{isOutputOpen ? "Hide" : "Show"} Output</Button>
            </CommandHeader>
            <Collapse isOpen={isOutputOpen}>
                <Pre>{jobOutput ? jobOutput : "Process not running"}</Pre>
            </Collapse>
        </Container>
    );
});

export default Command;
