import React from "react";
import styled from "styled-components";
import { Colors, Button } from "@blueprintjs/core";

const Container = styled.div`
  background: ${Colors.DARK_GRAY1};
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
  return (
    <Container>
      <Footer>
        <Button icon="add" intent="success" text="New Command" large />
      </Footer>
    </Container>
  );
};

export default Main;
