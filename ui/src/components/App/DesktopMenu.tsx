import { Button, Classes, Icon } from "@blueprintjs/core";
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
        .menu-button {
            -webkit-app-region: no-drag;
            &:hover {
                cursor: pointer;
            }
        }
        .title {
            padding-left: 10px;
        }
    }

    .theme-changer {
        -webkit-app-region: no-drag;
        margin-left: auto;
        margin-right: 50px;
    }

    .window-effects-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        -webkit-app-region: no-drag;
        .theme-changer {
            &:hover {
                cursor: pointer;
            }
        }
        .window-button {
            border-radius: 0;
            width: 3.2em;
        }
    }
`;

type TMinMaxIconType = "duplicate" | "square";

const DesktopMenu = () => {
    // Importing electron here so that code doesn't give compilation error when running in browser
    const { remote, ipcRenderer } = require("electron");
    const currentWindow = remote.getCurrentWindow();
    const startingIcon: TMinMaxIconType = currentWindow.isMaximized() ? "duplicate" : "square";

    const openAppMenu = e => {
        ipcRenderer.send(`display-app-menu`, {
            x: e.x,
            y: e.y,
        });
    };

    const { theme, setTheme } = useTheme();
    const [maximizeIcon, setMaximizeIcon] = React.useState<TMinMaxIconType>(startingIcon);
    const [isCloseButtonMinimal, setIsCloseButtonMinimal] = React.useState<boolean>(true);

    return (
        <MenuContainer theme={theme}>
            <span className="menu-container">
                <Button
                    className="menu-button"
                    icon="menu"
                    minimal={true}
                    onContextMenu={openAppMenu}
                    onClick={openAppMenu}
                />
                <span className="title">Ten Hands</span>
            </span>
            <div className="theme-changer">
                {theme === Classes.DARK ? (
                    <Button data-testid="theme-light" icon="moon" onClick={() => setTheme(`light`)} minimal={true}>
                        Dark
                    </Button>
                ) : (
                    <Button data-testid="theme-dark" icon="flash" onClick={() => setTheme(Classes.DARK)} minimal={true}>
                        Light
                    </Button>
                )}
            </div>

            <span className="window-effects-container">
                <Button
                    minimal={true}
                    className="window-button minimize-button"
                    onClick={() => {
                        currentWindow.isMinimizable() && currentWindow.minimize();
                    }}
                >
                    <Icon icon="minus" />
                </Button>
                <Button
                    minimal={true}
                    className="window-button min-max-button"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onClick={() => {
                        if (currentWindow.isMaximized()) {
                            currentWindow.unmaximize();
                            setMaximizeIcon("square");
                        } else {
                            currentWindow.maximize();
                            setMaximizeIcon("duplicate");
                        }
                    }}
                >
                    <Icon icon={maximizeIcon} iconSize={10} className="all-center" />
                </Button>
                <Button
                    minimal={isCloseButtonMinimal}
                    className="window-button close-button"
                    intent={!isCloseButtonMinimal ? "danger" : "none"}
                    onMouseOver={() => setIsCloseButtonMinimal(false)}
                    onMouseOut={() => setIsCloseButtonMinimal(true)}
                    onClick={() => {
                        remote.app.quit();
                    }}
                >
                    <Icon icon="cross" />
                </Button>
            </span>
        </MenuContainer>
    );
};

export default DesktopMenu;
