import { Button, Collapse, H5, Pre } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";

import { SocketContext } from "../utils/Context";

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
    pid: string | number;
}

class Command extends React.PureComponent<ICommandProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            isOutputOpen: true,
            socket: null,
            jobOutput: "",
            pid: "",
        };
    }

    public setOutputOpen = value => {
        this.setState({
            isOutputOpen: value,
        });
    };

    public startJob = socket => {
        const { command } = this.props;
        socket.emit("subscribe", {
            room: command._id,
            job: command.cmd,
        });
        socket.on("joined_room", data => {
            console.log(`Room Joined`, data);
        });
        socket.on("job_started", data => {
            console.log("data:", data);
            this.setState({
                pid: data.pid,
            });
        });
        socket.on("output", data => {
            console.log("data:", data);
            this.setState(prevState => {
                return {
                    jobOutput: prevState.jobOutput + data,
                };
            });
        });
        socket.on("job_killed", data => {
            this.setState(prevState => {
                return {
                    jobOutput: prevState.jobOutput + "process with id " + data + " killed by user.",
                };
            });
        });
    };

    public stopJob = socket => {
        const { command } = this.props;
        const { pid } = this.state;
        socket.emit("unsubscribe", {
            room: command._id,
            job: command.cmd,
            pid,
        });
    };

    public render() {
        const { command } = this.props;
        const { isOutputOpen, jobOutput } = this.state;
        return (
            <SocketContext.Consumer>
                {socket => (
                    <Container>
                        <CommandHeader>
                            <CommandTitleActions>
                                <H5>{command.name}</H5>
                                <Button
                                    data-testid="job-start"
                                    icon="play"
                                    intent="success"
                                    minimal={true}
                                    onClick={() => this.startJob(socket)}
                                />
                                <Button
                                    data-testid="job-stop"
                                    intent="danger"
                                    icon="stop"
                                    minimal={true}
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
                )}
            </SocketContext.Consumer>
        );
    }
}

// const Command: React.SFC<ICommandProps> = ({ command }) => {
//     const [isOutputOpen, setOutputOpen] = React.useState(true);
//     const socket = React.useContext(SocketContext);
//     const [jobOutput, setJobOutput] = React.useState("");

//     React.useEffect(() => {
//         socket.on(EventTypes.JOINED_ROOM, data => {
//             console.log(`Room Joined`, data);
//         });
//         socket.on("job_started", data => {
//             console.log(data);
//         });
//         socket.on("output", data => {
//             console.log("data:", data);
//             setJobOutput(jobOutput + data);
//         });
//         return () => {};
//     }, [jobOutput]);

//     function startJob() {
//         setJobOutput("");
//         console.log(command);
//         console.log(socket);
//         socket.emit(EventTypes.SUBSCRIBE, {
//             room: command._id,
//             job: command.cmd,
//         });
//     }

//     function stopJob() {}

//     return (
//         <Container>
//             <CommandHeader>
//                 <CommandTitleActions>
//                     <H5>{command.name}</H5>
//                     <Button data-testid="job-start" icon="play" intent="success" minimal={true} onClick={startJob} />
//                     <Button data-testid="job-stop" intent="danger" icon="stop" minimal={true} />
//                 </CommandTitleActions>
//                 <span>{command.command}</span>
//                 <Button onClick={() => setOutputOpen(!isOutputOpen)}>{isOutputOpen ? "Hide" : "Show"} Output</Button>
//             </CommandHeader>
//             <Collapse isOpen={isOutputOpen}>
//                 <Pre>{jobOutput ? jobOutput : "Process not running"}</Pre>
//             </Collapse>
//         </Container>
//     );
// };

export default Command;
