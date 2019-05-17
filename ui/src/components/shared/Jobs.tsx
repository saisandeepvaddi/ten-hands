import produce from "immer";
import localforage from "localforage";
import React from "react";
import useDeepCompareEffect from "use-deep-compare-effect";

localforage.config({
    name: "ten-hands",
});
// localforage.setDriver(localforage.LOCALSTORAGE);

// Reducer that saves state of jobs output

enum ACTION_TYPES {
    ADD_JOB,
    UPDATE_JOB,
    CLEAR_OUTPUT,
    RESTORE_STATE_FROM_STORAGE,
    UPDATE_JOB_PROCESS,
}

export let roomSocketState = {};

const initializeRoomSocketState = state => {
    Object.keys(state).forEach(room => {
        roomSocketState[room] = false;
    });
};

const setSocketInitialized = room => {
    roomSocketState[room] = true;
};

export const initialState = {};

export const jobsReducer = (state = initialState, action: IJobAction): object => {
    switch (action.type) {
        case ACTION_TYPES.ADD_JOB: {
            const room = action.room;
            const socketId = action.socketId;
            setSocketInitialized(room);

            if (!state.hasOwnProperty(room)) {
                return {
                    ...state,
                    [room]: {
                        stdout: "",
                        isRunning: false,
                        process: {
                            pid: -1,
                        },
                        socketId,
                    },
                };
            }

            return {
                ...state,
                [room]: {
                    ...state[room],
                    socketId,
                },
            };
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
    isJobsStateLoaded: boolean;
}

interface IJobsProviderProps {
    value?: IJobsContextValue;
    children: React.ReactNode;
}

export const JobsContext = React.createContext<IJobsContextValue | undefined>(undefined);

function JobsProvider(props: IJobsProviderProps) {
    const [state, dispatch] = React.useReducer(jobsReducer, initialState);
    const [isJobsStateLoaded, updateJobsState] = React.useState(false);

    React.useEffect(() => {
        const restoreData = async () => {
            try {
                const storedState = await localforage.getItem("state");
                if (storedState) {
                    dispatch({
                        type: ACTION_TYPES.RESTORE_STATE_FROM_STORAGE,
                        room: "none",
                        state: storedState,
                    });
                    initializeRoomSocketState(storedState);
                }
                updateJobsState(true);
            } catch (error) {
                console.log("error:", error);
            }
        };
        restoreData();
    }, []);
    useDeepCompareEffect(() => {
        const updateData = async () => {
            console.log("state:", state);
            localforage.setItem("state", state);
        };

        updateData();
    }, [state]);
    const value = React.useMemo(() => {
        return {
            state,
            dispatch,
            isJobsStateLoaded,
        };
    }, [state, dispatch, isJobsStateLoaded]);
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
