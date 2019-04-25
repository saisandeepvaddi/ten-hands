import React from "react";
import styled from "styled-components";
import { Colors, Button } from "@blueprintjs/core";

const Container = styled.div`
  background: ${Colors.DARK_GRAY2};
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

const Sidebar = () => {
  return (
    <Container>
      <Button
        icon="add"
        intent="success"
        text="New Project"
        large
        style={{ width: "100%" }}
      />
    </Container>
  );
};

export default Sidebar;
