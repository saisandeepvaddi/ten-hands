import localforage from "localforage";
import React from "react";

// Reducer that saves state of jobs output

enum ACTION_TYPES {
    ADD_JOB,
    UPDATE_JOB,
    CLEAR_OUTPUT,
    RESTORE_STATE_FROM_STORAGE,
    UPDATE_JOB_PROCESS,
}

/* 
  each job in state is
  "job-id": {
    "stdout": "",
  }

*/

export const initialState = {};

export const jobsReducer = (state = initialState, action: IJobAction): object => {
    switch (action.type) {
        case ACTION_TYPES.ADD_JOB: {
            const room = action.room;

            if (!state.hasOwnProperty(room)) {
                return {
                    ...state,
                    [room]: {
                        stdout: "",
                        isRunning: false,
                        process: {},
                    },
                };
            }

            return state;
        }
        case ACTION_TYPES.UPDATE_JOB: {
            const { room, stdout, isRunning } = action;
            return {
                ...state,
                [room]: {
                    ...state[room],
                    stdout: state[room].stdout + stdout,
                    isRunning,
                },
            };
        }
        case ACTION_TYPES.UPDATE_JOB_PROCESS: {
            const { room, process } = action;
            const pid = process && process.pid ? process.pid : -1;
            return {
                ...state,
                [room]: {
                    ...state[room],
                    isRunning: pid === -1 ? false : state[room].isRunning,
                    process,
                },
            };
        }
        case ACTION_TYPES.CLEAR_OUTPUT: {
            const room = action.room;
            return {
                ...state,
                [room]: {
                    ...state[room],
                    stdout: "",
                },
            };
        }
        case ACTION_TYPES.RESTORE_STATE_FROM_STORAGE: {
            return action.state!;
        }
        default:
            return state;
    }
};

interface IJobsContextValue {
    state: object;
    dispatch: React.Dispatch<IJobAction>;
}

interface IJobsProviderProps {
    value?: IJobsContextValue;
    children: React.ReactNode;
}

export const JobsContext = React.createContext<IJobsContextValue | undefined>(undefined);
localforage.config({
    name: "ten-hands",
});

function JobsProvider(props: IJobsProviderProps) {
    const [state, dispatch] = React.useReducer(jobsReducer, initialState);
    React.useEffect(() => {
        localforage.getItem("state").then(storedState => {
            if (storedState) {
                dispatch({
                    type: ACTION_TYPES.RESTORE_STATE_FROM_STORAGE,
                    room: "none",
                    state: storedState,
                });
            }
        });
    }, []);
    React.useEffect(() => {
        localforage.setItem("state", state);
    }, [state]);
    const value = React.useMemo(() => {
        return {
            state,
            dispatch,
        };
    }, [state, dispatch]);
    return <JobsContext.Provider value={value} {...props} />;
}

function useJobs() {
    const context = React.useContext(JobsContext);
    if (!context) {
        throw new Error("useJobs must be used within a JobsProvider");
    }
    return { ...context, ACTION_TYPES };
}

export { JobsProvider, useJobs };
