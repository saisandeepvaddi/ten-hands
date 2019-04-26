import React from "react";
import styled from "styled-components";
import { Colors, Button } from "@blueprintjs/core";
import { ThemeContext } from "../utils/Context";

const Container = styled.div`
  background: ${props =>
    props.theme === "bp3-dark" ? Colors.DARK_GRAY1 : Colors.LIGHT_GRAY1};
  height: 100%;
  display: flex;
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
    <Container theme={theme}>
      <Footer>
        <Button icon="add" intent="success" text="New Command" large />
      </Footer>
    </Container>
  );
};

export default Main;
