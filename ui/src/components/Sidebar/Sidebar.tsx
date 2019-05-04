import { Alignment, Button, Classes, Colors, Drawer, H5, Navbar, NavbarGroup, Position } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import { ProjectsContext, ThemeContext } from "../../utils/Context";

import ProjectsList from "../ProjectsList/ProjectsList";

const Container = styled.div`
    background: ${props => (props.theme === Classes.DARK ? Colors.DARK_GRAY2 : Colors.LIGHT_GRAY2)};
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
`;

const DrawerContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: left;
    padding: 1rem;
`;

interface ISidebarProps {
    setActiveProject?: any;
}

const Sidebar: React.FC<ISidebarProps> = ({ setActiveProject }) => {
    const theme = React.useContext(ThemeContext);
    const projects = React.useContext(ProjectsContext);
    const [isDrawerOpen, setDrawerOpen] = React.useState(false);

    return (
        <Container theme={theme}>
            <Button
                icon="add"
                intent="success"
                text="New Project"
                large={true}
                style={{ width: "100%" }}
                onClick={() => setDrawerOpen(true)}
            />
            <ProjectsList projects={projects} setActiveProject={setActiveProject} />
            <Drawer className={theme} isOpen={isDrawerOpen}>
                <DrawerContainer>
                    <div style={{ textAlign: "right" }}>
                        <Button
                            icon="small-cross"
                            intent="danger"
                            text="Close"
                            minimal={true}
                            onClick={() => setDrawerOpen(false)}
                        />
                    </div>
                </DrawerContainer>
            </Drawer>
        </Container>
    );
};

export default Sidebar;
