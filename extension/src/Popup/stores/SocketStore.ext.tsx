import chalk from "chalk";
import React from "react";
import io from "socket.io-client";
import { useConfig } from "./ConfigStore.ext";
import { useJobs } from "./JobStore.ext";
import { IProjectCommand } from "../../types";

// see https://github.com/xtermjs/xterm.js/issues/895#issuecomment-323221447
const options: any = { enabled: true, level: 3 };

interface ISocketContextValue {
  isSocketInitialized: boolean;
  initializeSocket: () => void;
  subscribeToTaskSocket: (
    room: string,
    command: IProjectCommand,
    projectPath: string,
    shell?: string
  ) => void;
  _socket: any;
  unsubscribeFromTaskSocket: (room: string, pid: number) => void;
  restartTask: (
    room: string,
    pid: number,
    command: IProjectCommand,
    projectPath: string,
    shell?: string
  ) => void;
}

interface ISocketProviderProps {
  value?: ISocketContextValue;
  children: React.ReactNode;
}

export const SocketsContext = React.createContext<
  ISocketContextValue | undefined
>(undefined);

function SocketsProvider(props: ISocketProviderProps) {
  const [isSocketInitialized, setSocketInitialized] = React.useState(false);
  const { dispatch, ACTION_TYPES } = useJobs();
  const { config } = useConfig();
  const _socket = React.useRef<any>();

  const updateJobProcess = (room, jobProcess) => {
    dispatch({
      room,
      type: ACTION_TYPES.UPDATE_JOB_PROCESS,
      process: jobProcess,
    });
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  const initializeSocket = React.useCallback(() => {
    _socket.current = io(`http://localhost:${config.port}`);

    if (isSocketInitialized) {
      return;
    }

    _socket.current.on(`connect`, () => {
      console.info("Socket connected to server");
    });

    _socket.current.on(`job_started`, (message) => {
      const room = message.room;
      console.info(`Process started for cmd: ${room}`);
      updateJobProcess(room, message.data);
    });
    // _socket.current.on(`job_output`, (message) => {
    //   const room = message.room;
    // });

    _socket.current.on(`job_error`, (message) => {
      const room = message.room;
      console.info(`Process error in room: ${room}`);
    });
    _socket.current.on(`job_close`, (message) => {
      const room = message.room;
      console.info(`Process close in room: ${room}`);
      // Add extra empty line. Otherwise, the terminal clear will retain last line.
      updateJobProcess(room, {
        pid: -1,
      });
    });

    _socket.current.on(`job_exit`, (message) => {
      const room = message.room;

      console.info(`Process exit in room: ${room}`);
      // Add extra empty line. Otherwise, the terminal clear will retain last line.
      updateJobProcess(room, {
        pid: -1,
      });
    });

    _socket.current.on(`job_killed`, (message) => {
      const room = message.room;

      console.info(
        `Process killed in room: ${room}; killed process id: ${message.data}`
      );

      updateJobProcess(room, {
        pid: -1,
      });
    });
    setSocketInitialized(true);
  }, []);

  const subscribeToTaskSocket = React.useCallback(
    (room, command, projectPath, shell) => {
      try {
        if (_socket && _socket.current) {
          _socket.current.emit("subscribe", {
            room,
            command,
            projectPath,
            shell,
          });
        }
      } catch (error) {
        console.error("subscribeToTaskSocket error:", error);
        throw error;
      }
    },
    []
  );

  const unsubscribeFromTaskSocket = React.useCallback((room, pid) => {
    try {
      if (_socket && _socket.current) {
        _socket.current.emit("unsubscribe", {
          room,
          pid,
        });
      }
    } catch (error) {
      console.error("unsubscribeFromTaskSocket error:", error);
      throw error;
    }
  }, []);

  const restartTask = React.useCallback(
    (room, pid, command, projectPath, shell) => {
      try {
        if (_socket && _socket.current) {
          _socket.current.emit("restart", {
            room,
            pid,
            command,
            projectPath,
            shell,
          });
        }
      } catch (error) {
        console.error("subscribeToTaskSocket error:", error);
        throw error;
      }
    },
    []
  );

  const value = React.useMemo(
    () => ({
      isSocketInitialized,
      initializeSocket,
      subscribeToTaskSocket,
      _socket,
      unsubscribeFromTaskSocket,
      restartTask,
    }),
    [
      isSocketInitialized,
      initializeSocket,
      subscribeToTaskSocket,
      _socket,
      unsubscribeFromTaskSocket,
      restartTask,
    ]
  );

  return <SocketsContext.Provider {...props} value={value} />;
}

function useSockets() {
  const context = React.useContext(SocketsContext);
  if (!context) {
    throw new Error("useSockets must be used within a ConfigProvider");
  }

  return context;
}

export { SocketsProvider, useSockets };
