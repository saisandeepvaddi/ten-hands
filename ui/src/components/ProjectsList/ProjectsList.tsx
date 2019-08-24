import { Code, Divider, Icon, Tab, Tabs } from "@blueprintjs/core";
import React, { useEffect, useRef } from "react";
import JobSocket from "../../utils/socket";

import styled from "styled-components";
import { useJobs } from "../shared/Jobs";
import JobTerminalManager from "../shared/JobTerminalManager";
import { useProjects } from "../shared/Projects";

import Axios, { AxiosResponse } from "axios";
import chalk from "chalk";
import { config } from "localforage";
import { getFileData } from "../App/dragDropProject";
import { AppToaster } from "../shared/App";
import { useConfig } from "../shared/Config";
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
    const { config } = useConfig();

    const [isSocketInitialized, setSocketInitialized] = React.useState(false);
    const { projects, setActiveProject, activeProject, updateProjects } = useProjects();
    const dragContainer = useRef<HTMLDivElement>(null);

    const handleProjectFileUpload = async file => {
        const responseData: AxiosResponse = await Axios({
            timeout: 5000,
            method: "post",
            baseURL: `http://localhost:${config.port}`,
            url: "projects",
            data: file,
        });
        const updatedProject = responseData.data;
        await updateProjects();
        setActiveProject(updatedProject);
    };

    const handleFileDrop = async dragContainerElement => {
        try {
            dragContainerElement.addEventListener("dragover", function(e) {
                e.preventDefault();
                e.stopPropagation();
            });

            dragContainerElement.addEventListener("drop", async e => {
                e.preventDefault();
                e.stopPropagation();
                const files = Array.prototype.slice.call(e.dataTransfer!.files);
                for (const file of files) {
                    const fileData = await getFileData(file);
                    handleProjectFileUpload(fileData);
                }
            });
        } catch (error) {
            console.error("error:", error);
            if (error.message) {
                AppToaster.show({ message: error.message });
            }
            // Display error message here.
        }
    };
    useEffect(() => {
        const dragContainerElement = dragContainer.current;
        if (!dragContainerElement) {
            throw new Error("Drag Area not found.");
        }

        handleFileDrop(dragContainerElement);
    }, []);

    const terminalManager = JobTerminalManager.getInstance();

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
        <Container ref={dragContainer}>
            <ProjectsListContainer />
            <div
                style={{
                    position: "absolute",
                    bottom: 20,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <span>
                    <Icon icon={"lightbulb"} intent="warning" /> Drop <Code>package.json</Code> here to add project.
                </span>
            </div>
        </Container>
    );
});

export default ProjectsList;
