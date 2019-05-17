import { Divider, Tab, Tabs } from "@blueprintjs/core";
import React from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import JobSocket from "../../utils/socket";
import { roomSocketState, useJobs } from "../shared/Jobs";
import { useProjects } from "../shared/Projects";

const isSocketInitialized = room => {
    return !!roomSocketState[room];
};

let isInit = false;

const ProjectsList = React.memo(() => {
    const { projects, setActiveProject, activeProject } = useProjects();
    const changeActiveProject = React.useCallback(
        projectId => {
            const activeProjectWithId = projects.find(project => project._id === projectId);
            if (activeProjectWithId) {
                setActiveProject(activeProjectWithId);
            }
        },
        [projects, setActiveProject],
    );
    if (projects.length === 0) {
        return <div />;
    }

    const { state: jobState, dispatch, ACTION_TYPES, isJobsStateLoaded } = useJobs();

    const socket = JobSocket.getSocket();

    const updateJob = (room, stdout, isRunning) => {
        dispatch({
            room,
            type: ACTION_TYPES.UPDATE_JOB,
            stdout,
            isRunning,
        });
    };

    const addJobToState = room => {
        dispatch({
            type: ACTION_TYPES.ADD_JOB,
            room,
            socketId: socket.id,
        });
    };

    const updateJobProcess = (room, jobProcess) => {
        dispatch({
            room,
            type: ACTION_TYPES.UPDATE_JOB_PROCESS,
            process: jobProcess,
        });
    };

    const clearJobOutput = room => {
        dispatch({
            type: ACTION_TYPES.CLEAR_OUTPUT,
            room,
        });
    };

    useDeepCompareEffect(() => {
        // TODO: save initialized sockets to ref or somewhere
        const initializeSocket = async () => {
            // If jobs are not loaded from data store, skip initializing
            // because this hook will run on job state change as well any way.
            // Skipping here prevents cleaning the store when reducer initialized with {} state
            // if (!isJobsStateLoaded) {
            //     return;
            // }

            // console.log("isSocketInitialized(room):", isSocketInitialized(room));
            if (isInit) {
                return;
            }
            // Check socket.on events for this room already initialized.
            // Otherwise, adds duplicate event listeners on switching tabs and coming back which makes duplicate joboutput
            // keys of jobState are registered rooms

            // const currentRooms = Object.keys(jobState);

            // if (currentRooms.indexOf(room) > -1) {
            //     console.info(`Room ${room} already exists. Skip initializing`);
            //     return;
            // // }

            // if (room === "c335466d-41b9-4154-b231-3f329d29fd8a") {
            //     console.log(`socket.id: ${socket.id}`);
            // }

            console.log("socket:", socket.id);
            socket.on(`job_started`, message => {
                const room = message.room;
                // setProcess(message.data);
                // updateJob("", true);
                updateJobProcess(room, message.data);
            });
            socket.on(`output`, message => {
                console.log("message:", message);
                const room = message.room;

                if (room === "c335466d-41b9-4154-b231-3f329d29fd8a") {
                    console.log(`output`);
                }
                updateJob(room, message.data, true);
            });

            socket.on(`close`, message => {
                const room = message.room;

                console.info(`Process close in room: ${room}`);
                updateJob(room, message.data, false);
            });

            socket.on(`error`, message => {
                const room = message.room;

                console.info(`Process error in room: ${room}`);
                updateJob(room, message.data, false);
            });

            socket.on(`exit`, message => {
                const room = message.room;

                console.info(`Process exit in room: ${room}`);
                updateJob(room, message.data, false);
            });

            socket.on(`job_killed`, message => {
                const room = message.room;

                console.info(`Process killed in room: ${room}; killed process id: ${message.data}`);
                updateJob(room, "process with id " + message.data + " killed by user.", false);
            });
            isInit = true;
        };

        initializeSocket();
        projects.forEach(project => {
            project.commands.forEach(command => {
                const room = command._id;
                addJobToState(room);
                // initializeSocket(room);
            });
        });
    }, [projects, jobState, isJobsStateLoaded]);

    return (
        <Tabs
            vertical={true}
            className={`w-100`}
            large={true}
            onChange={changeActiveProject}
            defaultSelectedTabId={projects[0]._id}
            selectedTabId={activeProject._id || projects[0]._id}
        >
            {/* <InputGroup className={Classes.FILL} type="text" placeholder="Search..." /> */}
            <Divider />
            {projects.map(project => (
                <Tab key={project._id} id={project._id} title={project.name} />
            ))}
        </Tabs>
    );
});

export default ProjectsList;
