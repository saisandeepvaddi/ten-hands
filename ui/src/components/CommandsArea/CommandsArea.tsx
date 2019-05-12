import { Card, Elevation } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import JobSocket from "../../utils/socket";
import Command from "../Command/Command";

interface ICommandsAreaProps {
    commands: IProjectCommand[];
}

const Container = styled.div`
    height: calc(100% - 50px);
    overflow-y: auto;
`;

const CommandsArea: React.SFC<ICommandsAreaProps> = ({ commands }) => {
    const socket = JobSocket.getSocket();
    return (
        <Container>
            {commands.map((command, key) => {
                return (
                    <Card key={key} elevation={Elevation.ONE} style={{ margin: 20 }}>
                        <Command command={command} socket={socket} />
                    </Card>
                );
            })}
        </Container>
    );
};

export default CommandsArea;
