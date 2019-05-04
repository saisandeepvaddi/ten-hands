import { Drawer } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import { ThemeContext } from "../../utils/Context";

const DrawerContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: left;
    padding: 1rem;
`;

interface INewDrawerProps {
    isDrawerOpen: boolean;
    setDrawerOpen: (isOpen: boolean) => any;
}

const NewProjectDrawer: React.FC<INewDrawerProps> = ({ isDrawerOpen, setDrawerOpen }) => {
    const theme = React.useContext(ThemeContext);

    return (
        <Drawer className={theme} isOpen={isDrawerOpen} title="Add Project" onClose={() => setDrawerOpen(false)}>
            <DrawerContainer />
        </Drawer>
    );
};

export default NewProjectDrawer;
