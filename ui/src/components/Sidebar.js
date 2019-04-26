import React from "react";
import styled from "styled-components";
import { Colors, Button } from "@blueprintjs/core";
import { ThemeContext } from "../utils/Context";

const Container = styled.div`
  background: ${props =>
    props.theme === "bp3-dark" ? Colors.DARK_GRAY2 : Colors.LIGHT_GRAY2};
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

const Sidebar = () => {
  const theme = React.useContext(ThemeContext);
  return (
    <Container theme={theme}>
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
