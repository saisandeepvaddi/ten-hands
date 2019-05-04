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

class Command extends React.PureComponent<ICommandProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            isOutputOpen: true,
            isRunning: false,
            socket: null,
            jobOutput: "",
            process: null,
            room: "",
        };
    }
    public componentDidMount() {
        const socket = JobSocket.getSocket();
        const { command } = this.props;
        const room = command._id;
        this.setState({
            socket,
        });
        socket.on(`joined_room-${room}`, message => {
            if (room === message.room) {
                console.info(message.data);
            }
        });
        socket.on(`job_started-${room}`, message => {
            console.info(`Job Started in room: ${room}`);
            this.setState({
                isRunning: true,
                process: message.data,
                jobOutput: "",
            });
        });
        socket.on(`output-${room}`, message => {
            if (room === message.room) {
                this.setState(prevState => {
                    return {
                        jobOutput: prevState.jobOutput + message.data,
                    };
                });
            }
        });

        socket.on(`close-${room}`, message => {
            if (room === message.room) {
                console.info(`Process close in room: ${room}`);
                this.setState(prevState => {
                    return {
                        isRunning: false,
                        jobOutput: prevState.jobOutput + message.data,
                    };
                });
            }
        });

        socket.on(`error-${room}`, message => {
            if (room === message.room) {
                console.info(`Process error in room: ${room}`);
                this.setState(prevState => {
                    return {
                        isRunning: true,
                        jobOutput: prevState.jobOutput + message.data,
                    };
                });
            }
        });

        socket.on(`exit-${room}`, message => {
            if (room === message.room) {
                console.info(`Process exit in room: ${room}`);

                this.setState(prevState => {
                    return {
                        isRunning: false,
                        jobOutput: prevState.jobOutput + message.data,
                    };
                });
            }
        });

        socket.on(`job_killed-${room}`, message => {
            if (room === message.room) {
                console.info(`Process killed in room: ${room}; killed process id: ${message.data}`);

                this.setState(prevState => {
                    return {
                        isRunning: false,
                        jobOutput: prevState.jobOutput + "process with id " + message.data + " killed by user.",
                    };
                });
            }
        });
    }

    public setOutputOpen = (value: boolean) => {
        this.setState({
            isOutputOpen: value,
        });
    };

    public startJob = socket => {
        const { command } = this.props;
        const room = command._id;
        const job = command.cmd;
        socket.emit("subscribe", {
            room,
            job,
        });
    };

    public stopJob = socket => {
        const { command } = this.props;
        const {
            process: { pid },
        } = this.state;
        socket.emit("unsubscribe", {
            room: command._id,
            job: command.cmd,
            pid,
        });
    };

    public render() {
        const { command } = this.props;
        const { isOutputOpen, jobOutput, socket, isRunning } = this.state;
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
                            onClick={() => this.startJob(socket)}
                        />
                        <Button
                            data-testid="job-stop"
                            intent="danger"
                            icon="stop"
                            minimal={true}
                            disabled={!isRunning}
                            onClick={() => this.stopJob(socket)}
                        />
                    </CommandTitleActions>
                    <span>{command.command}</span>
                    <Button onClick={() => this.setOutputOpen(!isOutputOpen)}>
                        {isOutputOpen ? "Hide" : "Show"} Output
                    </Button>
                </CommandHeader>
                <Collapse isOpen={isOutputOpen}>
                    <Pre>{jobOutput ? jobOutput : "Process not running"}</Pre>
                </Collapse>
            </Container>
        );
    }
}

export default Command;
