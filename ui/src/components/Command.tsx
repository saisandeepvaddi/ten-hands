import { Button, Collapse, H5, Pre } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";

interface ICommandProps {
    command: IProjectCommand;
}

const Container = styled.div``;

const CommandHeader = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Command: React.SFC<ICommandProps> = ({ command }) => {
    const [isOutputOpen, setOutputOpen] = React.useState(true);
    return (
        <Container>
            <CommandHeader>
                <H5>{command.name}</H5>
                <Button onClick={() => setOutputOpen(!isOutputOpen)}>{isOutputOpen ? "Hide" : "Show"} Output</Button>
            </CommandHeader>
            <span>{command.command}</span>
            <Collapse isOpen={isOutputOpen}>
                <Pre>{JSON.stringify(command, null, 2)}</Pre>
            </Collapse>
        </Container>
    );
};

export default Command;
