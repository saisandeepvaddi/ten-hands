import chalk from "chalk";
import React from "react";
import { io } from "socket.io-client";
import { useConfig } from "./ConfigStore";
import { useJobs } from "./JobStore";
import JobTerminalManager from "../JobTerminalManager";

// see https://github.com/xtermjs/xterm.js/issues/895#issuecomment-323221447
const options: any = { enabled: true, level: 3 };
const forcedChalk = new chalk.Instance(options);

interface ISocketContextValue {
  isSocketInitialized: boolean;
  initializeSocket: () => void;
  subscribeToTaskSocket: (
    taskID: string,
    command: IProjectCommand,
    projectPath: string,
    shell?: string
  ) => void;
  _socket: any;
  unsubscribeFromTaskSocket: (taskID: string, pid: number) => void;
  restartTask: (
    taskID: string,
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
  const terminalManager = JobTerminalManager.getInstance();
  const _socket = React.useRef<any>();

  const updateJob = (taskID, stdout, isRunning) => {
    terminalManager.updateOutputInRoom(taskID, stdout);
  };

  const updateJobProcess = (taskID, jobProcess) => {
    dispatch({
      taskID,
      type: ACTION_TYPES.UPDATE_JOB_PROCESS,
      process: jobProcess,
    });
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  const initializeSocket = React.useCallback(() => {
    const socketURL = `http://localhost:${config.port}/desktop`;
    _socket.current = io(socketURL, {
      withCredentials: true,
    });

    if (isSocketInitialized) {
      return;
    }

    _socket.current.on(`connect`, () => {
      // console.info("Socket connected to server");
    });

    _socket.current.on(`job_started`, (message) => {
      const taskID = message.taskID;
      console.info(`Process started for cmd: ${taskID}`);
      updateJobProcess(taskID, message.data);
      if (message.data.pid) {
        updateJob(
          taskID,
          `--Process started with PID: ${message.data.pid}--\n\n`,
          true
        );
      }
    });
    _socket.current.on(`job_output`, (message) => {
      const taskID = message.taskID;
      updateJob(taskID, message.data, true);
    });

    _socket.current.on(`job_error`, (message) => {
      const taskID = message.taskID;
      console.info(`Process error in taskID: ${taskID}`);
      updateJob(taskID, message.data, true);
    });
    _socket.current.on(`job_close`, (message) => {
      const taskID = message.taskID;
      console.info(`Process close in taskID: ${taskID}`);
      // Add extra empty line. Otherwise, the terminal clear will retain last line.
      updateJob(taskID, forcedChalk.bold(message.data + "\n"), false);
      updateJobProcess(taskID, {
        pid: -1,
      });
    });

    _socket.current.on(`job_exit`, (message) => {
      const taskID = message.taskID;

      console.info(`Process exit in taskID: ${taskID}`);
      // Add extra empty line. Otherwise, the terminal clear will retain last line.
      updateJob(taskID, forcedChalk.bold(message.data + "\n"), false);
      updateJobProcess(taskID, {
        pid: -1,
      });
    });

    _socket.current.on(`job_killed`, (message) => {
      const taskID = message.taskID;

      console.info(
        `Process killed in taskID: ${taskID}; killed process id: ${message.data}`
      );

      updateJob(
        taskID,
        forcedChalk.bold.redBright(
          `process with id ${message.data} killed by user.\n`
        ),
        false
      );
      updateJobProcess(taskID, {
        pid: -1,
      });
    });
    setSocketInitialized(true);
  }, []);

  const subscribeToTaskSocket = React.useCallback(
    (taskID, command, projectPath, shell) => {
      try {
        if (_socket && _socket.current) {
          _socket.current.emit("subscribe", {
            taskID,
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

  const unsubscribeFromTaskSocket = React.useCallback((taskID, pid) => {
    try {
      if (_socket && _socket.current) {
        _socket.current.emit("unsubscribe", {
          taskID,
          pid,
        });
      }
    } catch (error) {
      console.error("unsubscribeFromTaskSocket error:", error);
      throw error;
    }
  }, []);

  const restartTask = React.useCallback(
    (taskID, pid, command, projectPath, shell) => {
      try {
        if (_socket && _socket.current) {
          _socket.current.emit("restart", {
            taskID,
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
