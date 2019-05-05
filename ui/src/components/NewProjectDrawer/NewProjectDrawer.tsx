import { Classes, Drawer, FileInput, FormGroup, HTMLSelect, InputGroup, Label } from "@blueprintjs/core";
import { Field, Form, Formik, FormikActions, FormikFormProps, FormikProps, FormikValues, withFormik } from "formik";
import React, { useState } from "react";
import styled from "styled-components";
import { ThemeContext } from "../../utils/Context";
import handleConfigFiles from "./handleConfigFiles";
import NewProjectCommands from "./NewProjectCommands";

const DrawerContainer = styled.div`
    height: 100%;
    /* display: flex;
    flex-direction: column;
    align-items: center; */
    padding: 2rem;
`;

interface INewDrawerProps {
    isDrawerOpen: boolean;
    setDrawerOpen: (isOpen: boolean) => any;
}

const initialProject: IProject = {
    name: "",
    type: "none",
    commands: [],
    configFile: "",
    path: "",
};

// type FormikFormProps = IProjectProps

const NewProjectDrawer: React.FC<INewDrawerProps & FormikProps<IProject>> = ({
    isDrawerOpen,
    setDrawerOpen,
    handleSubmit,
    handleChange,
    setFieldValue,
    handleBlur,
    values,
    errors,
}) => {
    const theme = React.useContext(ThemeContext);

    const [fileName, setFileName] = useState("Choose file...");
    function onSubmit(values: IProject, { setSubmitting }: FormikActions<IProject>) {}

    function onProjectFileChange(e) {
        e.preventDefault();

        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onloadend = () => {
            const { name: selectedFileName } = file;
            console.info("file:", file);
            setFileName(selectedFileName);
            const readerResult = reader.result;
            const parsedProjectData = handleConfigFiles(file, readerResult);
            console.info("parsedProjectData:", parsedProjectData);
            if (parsedProjectData !== null) {
                const { name: projectName, type, commands, configFile, path } = parsedProjectData;
                console.info("{ name: projectName, type, commands, configFile }:", {
                    name: projectName,
                    type,
                    commands,
                    configFile,
                    path,
                });
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

        reader.readAsText(file);
    }

    return (
        <Drawer className={theme} isOpen={isDrawerOpen} title="Add Project" onClose={() => setDrawerOpen(false)}>
            <DrawerContainer>
                <Form>
                    <FormGroup labelFor="configFile" label="Project Config File" helperText="E.g., package.json">
                        <FileInput
                            text={fileName}
                            inputProps={{ id: "configFile" }}
                            fill={true}
                            onInputChange={onProjectFileChange}
                        />
                    </FormGroup>
                    <FormGroup
                        label="Project Name"
                        labelFor="name"
                        helperText="Will be auto-filled if available in config file."
                    >
                        <InputGroup id="name" type="text" onChange={handleChange} value={values.name} />
                    </FormGroup>
                    <FormGroup
                        label="Project Path"
                        labelFor="path"
                        helperText="Will be auto-filled if provided by user in config file (E.g., tenHandsConfig.path in package.json). Browsers won't tell path of uploaded file."
                    >
                        <InputGroup id="path" type="text" onChange={handleChange} value={values.path} />
                    </FormGroup>
                    <FormGroup
                        label="Project Type"
                        labelFor="type"
                        helperText="Will be auto-filled if can be determined from config file."
                    >
                        <HTMLSelect fill={true} id="type" onChange={handleChange} value={values.type}>
                            <option value="">Select Project Type</option>
                            <option value="nodejs">NodeJS</option>
                            <option value="dotnet-core">.NET Core</option>
                            <option value="other">Other</option>
                        </HTMLSelect>
                    </FormGroup>
                </Form>
            </DrawerContainer>
        </Drawer>
    );
};

const NewProjectFormWithFormik = {
    mapPropsToValues: props => {
        return initialProject;
    },

    handleSubmit: values => {},
};

export default withFormik<INewDrawerProps, IProject>(NewProjectFormWithFormik)(NewProjectDrawer);
