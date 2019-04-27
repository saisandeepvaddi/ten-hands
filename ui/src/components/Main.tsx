import { Button, Classes, Code, Colors } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import { ThemeContext } from "../utils/Context";

const Container = styled.div`
    border-top: 1px solid transparent; /* To prevent margin-collapse for first child doesn't happen */
    background: ${props => (props.theme === Classes.DARK ? Colors.DARK_GRAY1 : Colors.LIGHT_GRAY1)};
    height: 100%;
`;

const Footer = styled.div`
    width: 100%;
    position: absolute;
    bottom: 0;
    display: flex;
    padding: 1rem;
    align-items: center;
    & > button {
        margin-left: auto;
    }
`;

interface IMainProps {
    activeProject?: IProject | {};
}

const Main: React.FC<IMainProps> = ({ activeProject }) => {
    console.log("activeProject:", activeProject);
    const theme = React.useContext(ThemeContext);
    return (
        <Container theme={theme} className="test">
            <div className={Classes.RUNNING_TEXT} style={{ marginTop: 30 }}>
                <Code>Test</Code>
            </div>
            <Footer>
                <Button icon="add" intent="success" text="New Command" large={true} />
            </Footer>
        </Container>
    );
};

export default Main;
