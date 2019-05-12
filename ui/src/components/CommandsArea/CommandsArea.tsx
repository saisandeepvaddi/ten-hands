import { Card, Elevation } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import JobSocket from "../../utils/socket";
import Command from "../Command/Command";

interface ICommandsAreaProps {
    activeProject: IProject;
}

const Container = styled.div`
    height: calc(100% - 50px);
    overflow-y: auto;
`;

const CommandsArea: React.SFC<ICommandsAreaProps> = React.memo(({ activeProject }) => {
    const socket = JobSocket.getSocket();
    const commands: IProjectCommand[] = activeProject.commands;

    return (
        <Container>
            {commands.map((command, key) => {
                return (
                    <Card key={key} elevation={Elevation.ONE} style={{ margin: 20 }}>
                        <Command projectPath={activeProject.path} command={command} socket={socket} />
                    </Card>
                );
            })}
        </Container>
    );
});

export default CommandsArea;
