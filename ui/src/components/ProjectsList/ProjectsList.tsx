import { Divider, Tab, Tabs } from "@blueprintjs/core";
import React from "react";
import JobSocket from "../../utils/socket";

import styled from "styled-components";
import { useJobs } from "../shared/Jobs";
import JobTerminalManager from "../shared/JobTerminalManager";
import { useProjects } from "../shared/Projects";

import chalk from "chalk";
import ProjectsListContainer from "./ProjectsListContainer";

const Container = styled.div`
    height: 100%;
    width: 100%;
    overflow: auto;
`;

// see https://github.com/xtermjs/xterm.js/issues/895#issuecomment-323221447
const options: any = { enabled: true, level: 3 };
const forcedChalk = new chalk.constructor(options);

const ProjectsList = React.memo(() => {
    const [isSocketInitialized, setSocketInitialized] = React.useState(false);
    const { projects, setActiveProject, activeProject } = useProjects();
    const terminalManager = JobTerminalManager.getInstance();
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
        terminalManager.updateOutputInRoom(room, stdout);
    };

    const updateJobProcess = (room, jobProcess) => {
        dispatch({
            room,
            type: ACTION_TYPES.UPDATE_JOB_PROCESS,
            process: jobProcess,
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

            socket.on(`job_error`, message => {
                const room = message.room;
                console.info(`Process error in room: ${room}`);
                updateJob(room, message.data, true);
            });
            socket.on(`job_close`, message => {
                const room = message.room;
                console.info(`Process close in room: ${room}`);
                // Add extra empty line. Otherwise, the terminal clear will retain last line.
                updateJob(room, forcedChalk.bold(message.data + "\n"), false);
                updateJobProcess(room, {
                    pid: -1,
                });
            });

            socket.on(`job_exit`, message => {
                const room = message.room;

                console.info(`Process exit in room: ${room}`);
                // Add extra empty line. Otherwise, the terminal clear will retain last line.
                updateJob(room, forcedChalk.bold(message.data + "\n"), false);
                updateJobProcess(room, {
                    pid: -1,
                });
            });

            socket.on(`job_killed`, message => {
                const room = message.room;

                console.info(`Process killed in room: ${room}; killed process id: ${message.data}`);

                updateJob(room, forcedChalk.bold.redBright(`process with id ${message.data} killed by user.\n`), false);
                updateJobProcess(room, {
                    pid: -1,
                });
            });
            setSocketInitialized(true);
        };

        initializeSocket();
    }, [projects, isSocketInitialized]); // NEED TO THINK IF I SHOULD ADD OTHER DEPENDENCIES AS PER LINT WARNINGS. DON'T REINITIALIZE SOCKET ON CHANGE. WILL MESS UP

    return (
        <Container>
            <ProjectsListContainer />
            {/* <Tabs
                vertical={true}
                className={`w-100`}
                large={true}
                onChange={changeActiveProject}
                defaultSelectedTabId={projects[0]._id}
                selectedTabId={activeProject._id || projects[0]._id}
            >
                <Divider />
                {projects.map(project => (
                    <Tab key={project._id} id={project._id} title={project.name} />
                ))}
            </Tabs> */}
        </Container>
    );
});

export default ProjectsList;
