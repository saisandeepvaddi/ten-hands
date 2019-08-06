import { Alignment, Button, Classes, Icon, Navbar } from "@blueprintjs/core";
import React from "react";
import styled from "styled-components";
import { useTheme } from "../shared/Themes";

const MenuContainer = styled.div`
    -webkit-app-region: drag;
    z-index: 1;
    position: fixed;
    align-items: center;
    top: 0;
    right: 0;
    left: 0;
    display: flex;
    height: 30px;
    width: 100%;
    background: ${props => (props.theme === Classes.DARK ? "#293742" : "#BFCCD6")};
    justify-content: space-between;

    .menu-container {
        display: flex;
        align-items: center;
        &: first;
        margin: 0 5px;
        .title {
            padding-left: 10px;
        }
    }

    .theme-changer {
        -webkit-app-region: no-drag;
        &:hover {
            cursor: pointer;
        }
    }
`;

const DesktopMenu = () => {
    console.log("Here");

    const { theme, setTheme } = useTheme();
    return (
        <MenuContainer theme={theme}>
            <span className="menu-container">
                <Icon icon="menu" />
                <span className="title">Ten Hands</span>
            </span>

            <div className="theme-changer">
                {theme === Classes.DARK ? (
                    <Button data-testid="theme-light" icon="flash" onClick={() => setTheme(`light`)} minimal={true} />
                ) : (
                    <Button
                        data-testid="theme-dark"
                        icon="moon"
                        onClick={() => setTheme(Classes.DARK)}
                        minimal={true}
                    />
                )}
            </div>
        </MenuContainer>
    );
};

export default DesktopMenu;
