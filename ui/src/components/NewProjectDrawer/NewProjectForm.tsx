import { Button, FileInput, FormGroup, HTMLSelect, InputGroup } from "@blueprintjs/core";
import Axios, { AxiosResponse } from "axios";
import { Formik } from "formik";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { isRunningInElectron } from "../../utils/electron";
import { useConfig } from "../shared/Config";
import { useProjects } from "../shared/Projects";
import handleConfigFiles from "./handleConfigFiles";
import NewProjectCommands from "./NewProjectCommands";
import ProjectFileUpload from "./ProjectFileUpload";

const initialProject: IProject = {
    name: "",
    type: "none",
    commands: [],
    configFile: "",
    path: "",
};

const Container = styled.div`
    height: 100%;
    overflow: auto;
`;

interface INewProjectFormProps {
    setDrawerOpen: (isOpen: boolean) => any;
}

const NewProjectForm: React.FC<INewProjectFormProps> = React.memo(({ setDrawerOpen }) => {
    const [configFileName, setConfigFileName] = useState("");
    const { updateProjects, setActiveProject } = useProjects();
    const { config } = useConfig();

    const fillFormWithProjectConfig = (file: ITenHandsFile, setFieldValue) => {
        const parsedProjectData = handleConfigFiles(file);
        console.info("parsedProjectData:", parsedProjectData);
        if (parsedProjectData !== null) {
            const { name: projectName, type, commands, configFile, path } = parsedProjectData;
            // Manually set each field after parsing the file
            setFieldValue("configFile", configFile);
            setFieldValue("name", projectName);
            setFieldValue("type", type);
            setFieldValue("commands", commands);
            setFieldValue("path", path);
        } else {
            // If file not recognized, then fill empty values
            setFieldValue("configFile", file.name);
            setFieldValue("name", "");
            setFieldValue("type", "");
            setFieldValue("commands", "");
            setFieldValue("path", "");
        }
    };
    const onConfigFileUpload = useCallback((filePath, fileData, setFieldValue) => {
        try {
            if (isRunningInElectron()) {
                const path = require("path");
                const fileName = path.basename(filePath);
                const projectPath = path.dirname(filePath);
                const tenHandsFile: ITenHandsFile = {
                    name: fileName,
                    path: projectPath,
                    data: fileData,
                };
                setConfigFileName(fileName);

                fillFormWithProjectConfig(tenHandsFile, setFieldValue);
            }
        } catch (error) {
            console.log("error:", error);
        }
    }, []);

    const onProjectFileChange = useCallback((e, setFieldValue) => {
        e.preventDefault();

        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onloadend = () => {
            const { name } = file;
            setConfigFileName(name);
            const readerResult = reader.result;
            const tenHandsFile: ITenHandsFile = {
                name,
                data: readerResult,
            };

            fillFormWithProjectConfig(tenHandsFile, setFieldValue);
        };

        try {
            reader.readAsText(file);
        } catch (error) {
            // Happens when a file selected once and opens file dialog again and cancel without selecting any file.
            console.warn(`Error reading file. Did you select any file ?.`);
        }
    }, []);

    // const { fileName, values, handleChange, onProjectFileChange } = props;
    const handleSubmit = useCallback(
        async (values, actions) => {
            console.log("values:", values);
            // console.info("values:", values);
            try {
                actions.setSubmitting(true);
                const responseData: AxiosResponse = await Axios({
                    timeout: 5000,
                    method: "post",
                    baseURL: `http://localhost:${config.port}`,
                    url: "projects",
                    data: values,
                });
                actions.setSubmitting(false);
                const updatedProject = responseData.data;
                await updateProjects();
                setDrawerOpen(false);
                setActiveProject(updatedProject);
            } catch (error) {
                console.error(error);
                actions.setSubmitting(false);
            }
        },
        [setActiveProject, setDrawerOpen, updateProjects],
    );

    console.log("isRunningInElectron: ", isRunningInElectron());

    return (
        <Container>
            <Formik
                initialValues={initialProject}
                onSubmit={handleSubmit}
                render={props => (
                    <form onSubmit={props.handleSubmit}>
                        <FormGroup
                            labelFor="configFile"
                            label="Project Config File (Currently supports package.json. You can fill rest of the form manually or use CLI.)"
                            helperText="E.g., package.json"
                        >
                            {isRunningInElectron() ? (
                                <ProjectFileUpload
                                    configFileName={configFileName}
                                    onConfigFileUpload={(fileName, fileData) =>
                                        onConfigFileUpload(fileName, fileData, props.setFieldValue)
                                    }
                                />
                            ) : (
                                <FileInput
                                    text={configFileName || "Choose file..."}
                                    inputProps={{ id: "configFile" }}
                                    fill={true}
                                    onInputChange={e => onProjectFileChange(e, props.setFieldValue)}
                                />
                            )}
                        </FormGroup>
                        <FormGroup
                            label="Project Name"
                            labelFor="name"
                            helperText="Will be auto-filled if available in config file."
                        >
                            <InputGroup id="name" type="text" onChange={props.handleChange} value={props.values.name} />
                        </FormGroup>
                        <FormGroup
                            label="Project Path"
                            labelFor="path"
                            helperText="Will be auto-filled if using desktop app. Alternatively, Add project with CLI or add tenHands.path in project.json or type full project path here."
                        >
                            <InputGroup
                                required={true}
                                id="path"
                                type="text"
                                onChange={props.handleChange}
                                value={props.values.path}
                            />
                        </FormGroup>
                        <FormGroup
                            label="Project Type"
                            labelFor="type"
                            helperText="Will be auto-filled if they can be determined from config file."
                        >
                            <HTMLSelect fill={true} id="type" onChange={props.handleChange} value={props.values.type}>
                                <option value="">Select Project Type</option>
                                <option value="nodejs">NodeJS</option>
                                <option value="other">Other</option>
                            </HTMLSelect>
                        </FormGroup>
                        <FormGroup
                            label="Commands"
                            labelFor="commands"
                            helperText="Will be auto-filled if can be determined from config file."
                        >
                            <NewProjectCommands commands={props.values.commands} />
                        </FormGroup>
                        <FormGroup>
                            <Button
                                intent="primary"
                                text="Save Project"
                                type="submit"
                                loading={props.isSubmitting}
                                large={true}
                            />
                        </FormGroup>
                    </form>
                )}
            />
        </Container>
    );
});

export default NewProjectForm;
