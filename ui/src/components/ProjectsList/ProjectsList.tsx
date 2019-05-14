import { Divider, Tab, Tabs } from "@blueprintjs/core";
import React from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import JobSocket from "../../utils/socket";
import { useJobs } from "../shared/Jobs";
import { useProjects } from "../shared/Projects";

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

    const { state: jobState, dispatch, ACTION_TYPES } = useJobs();

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
        const initializeSocket = async room => {
            // Check socket.on events for this room already initialized.
            // Otherwise, adds duplicate event listeners on switching tabs and coming back which makes duplicate joboutput
            // keys of jobState are registered rooms

            const currentRooms = Object.keys(jobState);

            if (currentRooms.indexOf(room) > -1) {
                console.info(`Room ${room} already exists. Skip initializing`);
                return;
            }

            addJobToState(room);
            socket.on(`job_started-${room}`, message => {
                console.info(`Job Started in room: ${room}`);
                // setProcess(message.data);
                // updateJob("", true);
                updateJobProcess(room, message.data);
            });
            socket.on(`output-${room}`, message => {
                if (room === message.room) {
                    updateJob(room, message.data, true);
                }
            });

            socket.on(`close-${room}`, message => {
                if (room === message.room) {
                    console.info(`Process close in room: ${room}`);
                    updateJob(room, message.data, false);
                }
            });

            socket.on(`error-${room}`, message => {
                if (room === message.room) {
                    console.info(`Process error in room: ${room}`);
                    updateJob(room, message.data, false);
                }
            });

            socket.on(`exit-${room}`, message => {
                if (room === message.room) {
                    console.info(`Process exit in room: ${room}`);
                    updateJob(room, message.data, false);
                }
            });

            socket.on(`job_killed-${room}`, message => {
                if (room === message.room) {
                    console.info(`Process killed in room: ${room}; killed process id: ${message.data}`);
                    updateJob(room, "process with id " + message.data + " killed by user.", false);
                }
            });
        };

        projects.forEach(project => {
            project.commands.forEach(command => {
                const room = command._id;
                console.log("room:", room);
                initializeSocket(room);
            });
        });
    }, projects);

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
