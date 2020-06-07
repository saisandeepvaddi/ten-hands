import throttle from "lodash/throttle";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useConfig } from "../shared/stores/ConfigStore";
import JobTerminal from "../shared/JobTerminal";
import JobTerminalManager from "../shared/JobTerminalManager";
import { useTheme } from "../shared/stores/ThemeStore";
import { ResizableBox } from "react-resizable";

interface ICommandProps {
  room: string;
  index: number;
  containerWidth: number;
}

const TerminalContainer = styled.div`
  width: 100%;
  height: 100%;
  white-space: pre-wrap;
`;

const CommandOutputXterm: React.FC<ICommandProps> = React.memo(
  ({ room, index, containerWidth }) => {
    const elRef = React.useRef<HTMLDivElement>(null);
    const terminal = React.useRef<JobTerminal | null>(null);
    const { theme } = useTheme();
    const currentTheme = React.useRef<any>(null);
    const themeTimeout = React.useRef<any>(null);
    const [height, setHeight] = useState<number>(400);
    const [width, setWidth] = useState<number>(800);
    const { config } = useConfig();

    const setTheme = () => {
      if (terminal && terminal.current) {
        terminal.current.setTheme(theme);
        if (currentTheme && currentTheme.current) {
          currentTheme.current = theme;
        }
      }
    };

    const removeTheme = () => {
      if (terminal && terminal.current) {
        terminal.current.removeTheme();
      }
    };

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
      if (elRef && elRef.current) {
        const parentWidth =
          elRef.current.parentElement?.parentElement?.getBoundingClientRect()
            .width ?? 800;
        const parentHeight =
          elRef.current.parentElement?.parentElement?.getBoundingClientRect()
            .height ?? 400;
        console.log("parentWidth:parentHeight", parentWidth, parentHeight);
        setHeight(parentHeight);
        setWidth(parentWidth);
        if (terminal.current === null) {
          terminal.current = JobTerminalManager.getInstance().createJobTerminal(
            room
          );
          terminal.current.attachTo(elRef.current);
        }
      }
    }, []);

    useEffect(() => {
      if (!config.enableTerminalTheme) {
        removeTheme();
      }

      setTheme();

      return () => {
        // Remove unmounting
        removeTheme();
        if (themeTimeout.current) {
          clearTimeout(themeTimeout.current);
        }
      };
    }, [theme, config, index]);

    const handleResize = React.useCallback(
      throttle((height: number) => {
        if (terminal && terminal.current) {
          setHeight(height);
          terminal.current.fitAddon.fit();
        }
      }, 100),
      [terminal]
    );

    useEffect(() => {
      setWidth(containerWidth);
    }, [containerWidth]);

    useEffect(() => {
      terminal.current?.fitAddon.fit();
    }, [width]);

    return (
      <ResizableBox
        axis="y"
        resizeHandles={["s"]}
        width={width}
        height={height}
        onResize={(e, { size }) => {
          handleResize(size.height);
        }}
      >
        <TerminalContainer ref={elRef} />
      </ResizableBox>
    );
  }
);

export default CommandOutputXterm;
