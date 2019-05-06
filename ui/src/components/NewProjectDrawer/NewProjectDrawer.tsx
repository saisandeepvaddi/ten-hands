import { Drawer } from "@blueprintjs/core";
import { FormikProps, withFormik } from "formik";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { ThemeContext } from "../../utils/Context";
import handleConfigFiles from "./handleConfigFiles";
import NewProjectForm from "./NewProjectForm";

const DrawerContainer = styled.div`
    height: 100%;
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

    // function onSubmit(formValues: IProject, { setSubmitting }: FormikActions<IProject>) {}

    const onProjectFileChange = useCallback(
        e => {
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
        [setFieldValue],
    );

    return (
        <Drawer className={theme} isOpen={isDrawerOpen} title="Add Project" onClose={() => setDrawerOpen(false)}>
            <DrawerContainer>
                <NewProjectForm
                    values={values}
                    fileName={fileName}
                    handleChange={handleChange}
                    onProjectFileChange={onProjectFileChange}
                />
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
