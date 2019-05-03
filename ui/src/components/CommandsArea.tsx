import { Card, Elevation } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import Command from "./Command";

interface ICommandsAreaProps {
    commands: IProjectCommand[];
    splitDirection: string;
}

const Container = styled.div`
    height: 94%;
    overflow-y: auto;
`;

const CommandsArea: React.SFC<ICommandsAreaProps> = ({ commands, splitDirection }) => {
    return (
        <Container>
            {commands.map((command, key) => {
                return (
                    <Card key={key} elevation={Elevation.ONE} style={{ margin: 20 }}>
                        <Command command={command} />
                    </Card>
                );
            })}
        </Container>
    );
};

export default CommandsArea;
