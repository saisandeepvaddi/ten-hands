import { Button, Collapse, H5, Pre } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";

import { SocketContext } from "../utils/Context";

interface ICommandProps {
    command: IProjectCommand;
}

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

const Command: React.SFC<ICommandProps> = ({ command }) => {
    const [isOutputOpen, setOutputOpen] = React.useState(true);
    const socket = React.useContext(SocketContext);
    function startJob() {
        console.log(command);
    }

    function stopJob() {}

    return (
        <Container>
            <CommandHeader>
                <CommandTitleActions>
                    <H5>{command.name}</H5>
                    <Button data-testid="job-start" icon="play" intent="success" minimal={true} onClick={startJob} />
                    <Button data-testid="job-stop" intent="danger" icon="stop" minimal={true} />
                </CommandTitleActions>
                <span>{command.command}</span>
                <Button onClick={() => setOutputOpen(!isOutputOpen)}>{isOutputOpen ? "Hide" : "Show"} Output</Button>
            </CommandHeader>
            <Collapse isOpen={isOutputOpen}>
                <Pre>{JSON.stringify(command, null, 2)}</Pre>
            </Collapse>
        </Container>
    );
};

export default Command;
