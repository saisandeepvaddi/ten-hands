import { Card, Classes, Elevation, H3, H5, Pre } from "@blueprintjs/core";
import React from "react";
import Split from "react-split";
import styled from "styled-components";

interface ICommandsAreaProps {
    commands: IProjectCommand[];
    splitDirection: string;
}

const Container = styled.div`
    height: 100%;
    overflow-y: auto;
`;

const CommandsArea: React.SFC<ICommandsAreaProps> = ({ commands, splitDirection }) => {
    return (
        <Container>
            {commands.map((command, key) => {
                return (
                    <Card key={key} elevation={Elevation.ONE} style={{ margin: 20 }}>
                        <div className={Classes.RUNNING_TEXT}>
                            <H3>{command.name}</H3>
                            <H5>{command.command}</H5>
                            <Pre>{JSON.stringify(command, null, 2)}</Pre>
                        </div>
                    </Card>
                );
            })}
        </Container>
    );
};

export default CommandsArea;
