import { IResizeEntry, ResizeSensor } from "@blueprintjs/core";
import debounce from "lodash/debounce";
import React, { useEffect } from "react";
import styled from "styled-components";
import { useConfig } from "../shared/Config";
import JobTerminal from "../shared/JobTerminal";
import JobTerminalManager from "../shared/JobTerminalManager";
import { useTheme } from "../shared/Themes";

interface ICommandProps {
    room: string;
}

const TerminalContainer = styled.div`
    flex: 1;
    max-width: 100%;
    padding: 10px;
    white-space: pre-wrap;
`;

const CommandOutputXterm: React.FC<ICommandProps> = React.memo(({ room }) => {
    const elRef = React.useRef<HTMLDivElement>(null);
    const terminal = React.useRef<JobTerminal | null>(null);
    const { theme } = useTheme();
    const currentTheme = React.useRef<any>(null);
    const { config } = useConfig();

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if (elRef && elRef.current) {
            if (terminal.current === null) {
                terminal.current = JobTerminalManager.getInstance().createJobTerminal(room);
                terminal.current.attachTo(elRef.current);
            }
        }
    }, []);

    useEffect(() => {
        const setTerminalTheme = () => {
            if (!config.enableTerminalTheme) {
                if (terminal && terminal.current) {
                    terminal.current.removeTheme();
                }
                return;
            }

            try {
                const hasATheme = terminal.current!.getTheme();
                if (
                    hasATheme !== undefined &&
                    JSON.stringify(hasATheme) !== "{}" &&
                    theme === currentTheme.current &&
                    currentTheme.current
                ) {
                    console.log("theme: Not setting theme again");
                    return;
                }
            } catch (error) {
                console.log("error:", error);
            }

            let themeTimeout: any = null;
            // Setting theme is taking a LOOOOOOOOOONG time.
            // So had to do it later in a different call stack.
            const setThemeLater = () => {
                themeTimeout = setTimeout(() => {
                    if (terminal && terminal.current) {
                        terminal.current.setTheme(theme);
                        if (currentTheme && currentTheme.current) {
                            currentTheme.current = theme;
                        }
                    }
                }, 0);
            };
            setThemeLater();
            return () => {
                if (themeTimeout) {
                    clearTimeout(themeTimeout);
                }
            };
        };

        const clearTimer = setTerminalTheme();
        return () => {
            if (terminal && terminal.current) {
                terminal.current.removeTheme();
            }
            clearTimer && clearTimer();
        };
    }, [theme, config]);

    const handleResize = React.useCallback(
        debounce((entries: IResizeEntry[]) => {
            let resizeTimeout: any = null;
            const resizeLater = () => {
                resizeTimeout = setTimeout(() => {
                    if (terminal && terminal.current && entries.length > 0) {
                        const width: number = entries[0].contentRect.width;
                        terminal.current.resizeTerminal(width);
                    }
                }, 0);
            };
            resizeLater();
            return () => {
                clearTimeout(resizeTimeout);
            };
        }, 50),
        [terminal],
    );

    return (
        <ResizeSensor onResize={handleResize}>
            <TerminalContainer ref={elRef} />
        </ResizeSensor>
    );
});

export default CommandOutputXterm;
