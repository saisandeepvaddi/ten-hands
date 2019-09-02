import { Card, Elevation } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import JobSocket from "../../utils/socket";
import Command from "../Command/Command";
import { useTheme } from "../shared/Themes";

interface ICommandsAreaProps {
    activeProject: IProject;
}

const Container = styled.div`
    height: calc(100% - 50px);
    overflow: auto;
`;

const EmptyContainer = styled(Container)`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2em;
    & > span {
        padding: 10px;
        border-bottom: 1px solid #0a6640;
    }
`;

const CommandsArea: React.SFC<ICommandsAreaProps> = React.memo(({ activeProject }) => {
    const socket = JobSocket.getSocket();
    const commands: IProjectCommand[] = activeProject.commands;
    const { theme } = useTheme();

    if (commands.length === 0) {
        return (
            <EmptyContainer theme={theme} className="main-container">
                There are no tasks in the project
            </EmptyContainer>
        );
    }
    return (
        <Container>
            {commands.map(command => {
                return (
                    <Card key={command._id} elevation={Elevation.ONE} style={{ margin: 20 }}>
                        <Command projectPath={activeProject.path} command={command} socket={socket} />
                    </Card>
                );
            })}
        </Container>
    );
});

export default CommandsArea;
