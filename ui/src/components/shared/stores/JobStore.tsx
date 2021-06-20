import localforage from "localforage";
import throttle from "lodash/throttle";
import React from "react";

import { useMountedState } from "../hooks";

localforage.config({
  name: "ten-hands",
});

// Reducer that saves state of jobs output

export enum ACTION_TYPES {
  UPDATE_JOB,
  CLEAR_OUTPUT,
  RESTORE_STATE_FROM_STORAGE,
  UPDATE_JOB_PROCESS,
}

export const roomSocketState = {};

const initializeRoomSocketState = (state) => {
  Object.keys(state).forEach((taskID) => {
    roomSocketState[taskID] = false;
  });
};

const updateData = throttle(async (data) => {
  try {
    if (Object.keys(data).length > 0) {
      await localforage.setItem("state", data);
    }
  } catch (error) {
    console.log("error:", error);
  }
}, 200);

export const initialState = {};

export const jobsReducer = (
  state = initialState,
  action: IJobAction
): Record<any, any> => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_JOB: {
      const { taskID, stdout, isRunning } = action;
      const newStdout = state[taskID] ? stdout : "";
      return {
        ...state,
        [taskID]: {
          ...state[taskID],
          stdout: newStdout,
          isRunning,
        },
      };
    }
    case ACTION_TYPES.UPDATE_JOB_PROCESS: {
      const { taskID, process } = action;
      const pid = process && process.pid ? process.pid : -1;

      const newState = {
        ...state,
        [taskID]: {
          ...state[taskID],
          isRunning: pid === -1 ? false : true,
          process,
        },
      };
      updateData(newState);
      return newState;
    }
    case ACTION_TYPES.CLEAR_OUTPUT: {
      const taskID = action.taskID;

      return {
        ...state,
        [taskID]: {
          ...state[taskID],
          stdout: "",
        },
      };
    }
    case ACTION_TYPES.RESTORE_STATE_FROM_STORAGE: {
      return action.state ?? state;
    }
    default:
      return state;
  }
};

interface IJobsContextValue {
  state: Record<any, any>;
  dispatch: React.Dispatch<IJobAction>;
  runningTasks: Record<string, boolean>;
  isTaskRunning: (taskId: string) => boolean;
}

interface IJobsProviderProps {
  value?: IJobsContextValue;
  children: React.ReactNode;
}

export const JobsContext = React.createContext<IJobsContextValue | undefined>(
  undefined
);

function JobsProvider(props: IJobsProviderProps) {
  const isMounted = useMountedState();
  const [state, dispatch] = React.useReducer(jobsReducer, initialState);
  const [runningTasks, setRunningTasks] = React.useState<any>({});

  const isTaskRunning = React.useCallback(
    (taskId: string) => {
      return runningTasks[taskId] === true;
    },
    [runningTasks]
  );

  React.useEffect(() => {
    const keys = Object.keys(state);

    if (!keys || keys.length === 0) {
      setRunningTasks({});
      return;
    }

    const newTaskStatus = {};

    keys.forEach((key) => {
      newTaskStatus[key] = (state[key] && state[key].isRunning) || false;
    });

    if (isMounted()) {
      setRunningTasks(newTaskStatus);
    }
  }, [state, isMounted]);

  React.useEffect(() => {
    const restoreData = async () => {
      try {
        const storedState: any = await localforage.getItem("state");
        if (storedState) {
          dispatch({
            type: ACTION_TYPES.RESTORE_STATE_FROM_STORAGE,
            taskID: "none",
            state: storedState,
          });
          initializeRoomSocketState(storedState);
        }
      } catch (error) {
        console.log("error:", error);
      }
    };
    restoreData();
  }, []);

  const value = React.useMemo(() => {
    return {
      state,
      dispatch,
      runningTasks,
      isTaskRunning,
    };
  }, [state, dispatch, runningTasks, isTaskRunning]);
  return <JobsContext.Provider value={value} {...props} />;
}

function useJobs() {
  const context = React.useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
}

export { JobsProvider, useJobs };
