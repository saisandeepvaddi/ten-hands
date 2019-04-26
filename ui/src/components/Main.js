import React from "react";
import styled from "styled-components";
import { Colors, Button } from "@blueprintjs/core";
import { ThemeContext } from "../utils/Context";

const Container = styled.div`
  border-top: 1px solid transparent; /* To prevent margin-collapse for first child doesn't happen */
  background: ${props =>
    props.theme === "bp3-dark" ? Colors.DARK_GRAY1 : Colors.LIGHT_GRAY1};
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

const Main = () => {
  const theme = React.useContext(ThemeContext);
  return (
    <Container theme={theme} className="test">
      <div className="bp3-running-text" style={{ marginTop: 30 }}>
        <code>Test</code>
      </div>
      <Footer>
        <Button icon="add" intent="success" text="New Command" large />
      </Footer>
    </Container>
  );
};

export default Main;
