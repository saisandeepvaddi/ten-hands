import { Button, FileInput, FormGroup, HTMLSelect, InputGroup } from "@blueprintjs/core";
import Axios, { AxiosResponse } from "axios";
import { Formik } from "formik";
import React, { useCallback, useState } from "react";
import { useProjects } from "../shared/Projects";
import handleConfigFiles from "./handleConfigFiles";
import NewProjectCommands from "./NewProjectCommands";

const initialProject: IProject = {
    name: "",
    type: "none",
    commands: [],
    configFile: "",
    path: "",
};

interface INewProjectFormProps {
    setDrawerOpen: (isOpen: boolean) => any;
}

const NewProjectForm: React.FC<INewProjectFormProps> = React.memo(({ setDrawerOpen }) => {
    const [fileName, setFileName] = useState("Choose file...");
    const { updateProjects, setActiveProject } = useProjects();

    const onProjectFileChange = useCallback(
        (e, setFieldValue) => {
            e.preventDefault();

            const reader = new FileReader();
            const file = e.target.files[0];

            reader.onloadend = () => {
                const { name: selectedFileName } = file;
                // console.info("file:", file);
                setFileName(selectedFileName);
                const readerResult = reader.result;
                const parsedProjectData = handleConfigFiles(file, readerResult);
                // console.info("parsedProjectData:", parsedProjectData);
                if (parsedProjectData !== null) {
                    const { name: projectName, type, commands, configFile, path } = parsedProjectData;
                    console.info("{ name: projectName, type, commands, configFile }:", {
                        name: projectName,
                        type,
                        commands,
                        configFile,
                        path,
                    });

                    // Manually set each field after parsing the file
                    setFieldValue("configFile", configFile);
                    setFieldValue("name", projectName);
                    setFieldValue("type", type);
                    setFieldValue("commands", commands);
                    setFieldValue("path", path);
                } else {
                    // If file not recognized, then fill empty values
                    setFieldValue("configFile", selectedFileName);
                    setFieldValue("name", "");
                    setFieldValue("type", "");
                    setFieldValue("commands", "");
                    setFieldValue("path", "");
                }
            };

            try {
                reader.readAsText(file);
            } catch (error) {
                // Happens when a file selected once and opens file dialog again and cancel without selecting any file.
                console.warn(`Error reading file. Did you select any file ?.`);
            }
        },
        [setDrawerOpen],
    );

    // const { fileName, values, handleChange, onProjectFileChange } = props;
    const handleSubmit = useCallback(async (values, actions) => {
        console.info("values:", values);
        try {
            actions.setSubmitting(true);
            const responseData: AxiosResponse = await Axios({
                timeout: 2000,
                method: "post",
                baseURL: `http://localhost:1010`,
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
    }, []);

    return (
        <Formik
            initialValues={initialProject}
            onSubmit={handleSubmit}
            render={props => (
                <form onSubmit={props.handleSubmit}>
                    <FormGroup labelFor="configFile" label="Project Config File" helperText="E.g., package.json">
                        <FileInput
                            text={fileName}
                            inputProps={{ id: "configFile" }}
                            fill={true}
                            onInputChange={e => onProjectFileChange(e, props.setFieldValue)}
                        />
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
                        helperText="Will be auto-filled if provided by user in config file (E.g., tenHandsConfig.path in package. Browsers do not reveal the path of selected file. Adding project with Ten-Hands CLI could be useful."
                    >
                        <InputGroup id="path" type="text" onChange={props.handleChange} value={props.values.path} />
                    </FormGroup>
                    <FormGroup
                        label="Project Type"
                        labelFor="type"
                        helperText="Will be auto-filled if can be determined from config file."
                    >
                        <HTMLSelect fill={true} id="type" onChange={props.handleChange} value={props.values.type}>
                            <option value="">Select Project Type</option>
                            <option value="nodejs">NodeJS</option>
                            <option value="dotnet-core">.NET Core</option>
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
                        <Button intent="primary" text="Save" type="submit" loading={props.isSubmitting} />
                    </FormGroup>
                </form>
            )}
        />
    );
});

export default NewProjectForm;
