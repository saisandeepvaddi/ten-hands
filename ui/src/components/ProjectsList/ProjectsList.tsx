import { Divider, Tab, Tabs } from "@blueprintjs/core";
import React from "react";
import JobSocket from "../../utils/socket";
import { useJobs } from "../shared/Jobs";
import { useProjects } from "../shared/Projects";

const ProjectsList = React.memo(() => {
    const [isSocketInitialized, setSocketInitialized] = React.useState(false);
    const { projects, setActiveProject, activeProject } = useProjects();
    const changeActiveProject = React.useCallback(
        projectId => {
            const activeProjectWithId = projects.find(project => project._id === projectId);
            if (activeProjectWithId) {
                setActiveProject(activeProjectWithId);
            } else {
                setActiveProject({
                    _id: "",
                    name: "",
                    type: "",
                    path: "",
                    commands: [],
                });
            }
        },
        [projects, setActiveProject],
    );
    if (projects.length === 0) {
        return <div />;
    }

    const { dispatch, ACTION_TYPES } = useJobs();

    const socket = JobSocket.getSocket();

    const updateJob = (room, stdout, isRunning) => {
        dispatch({
            room,
            type: ACTION_TYPES.UPDATE_JOB,
            stdout,
            isRunning,
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

    React.useEffect(() => {
        // TODO: save initialized sockets to ref or somewhere
        const initializeSocket = async () => {
            if (isSocketInitialized) {
                return;
            }

            socket.on(`job_started`, message => {
                const room = message.room;
                console.info(`Process started for cmd: ${room}`);
                updateJobProcess(room, message.data);
            });
            socket.on(`job_output`, message => {
                const room = message.room;
                updateJob(room, message.data, true);
            });

            socket.on(`job_close`, message => {
                const room = message.room;
                console.info(`Process close in room: ${room}`);
                updateJob(room, message.data, false);
            });

            socket.on(`job_error`, message => {
                const room = message.room;

                console.info(`Process error in room: ${room}`);
                updateJob(room, message.data, false);
            });

            socket.on(`job_exit`, message => {
                const room = message.room;

                console.info(`Process exit in room: ${room}`);
                updateJob(room, message.data, false);
            });

            socket.on(`job_killed`, message => {
                const room = message.room;

                console.info(`Process killed in room: ${room}; killed process id: ${message.data}`);
                updateJob(room, "process with id " + message.data + " killed by user.", false);
            });
            setSocketInitialized(true);
        };

        initializeSocket();
    }, [projects, isSocketInitialized]);

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
