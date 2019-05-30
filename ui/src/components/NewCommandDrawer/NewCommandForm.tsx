import { Button, FileInput, FormGroup, HTMLSelect, InputGroup } from "@blueprintjs/core";
import Axios, { AxiosResponse } from "axios";
import { Formik } from "formik";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { isRunningInElectron } from "../../utils/electron";
import { useConfig } from "../shared/Config";
import { useProjects } from "../shared/Projects";

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
    const { updateProjects, setActiveProject, activeProject } = useProjects();
    console.log("activeProject:", activeProject);
    const { config } = useConfig();

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

    return (
        <Container>
            <Formik
                initialValues={initialProject}
                onSubmit={handleSubmit}
                render={props => (
                    <form onSubmit={props.handleSubmit}>
                        <FormGroup label="Name" labelFor="name" helperText="A short name for your command.">
                            <InputGroup
                                required={true}
                                placeholder="E.g., Start DB"
                                id="name"
                                type="text"
                                onChange={props.handleChange}
                                value={props.values.name}
                            />
                        </FormGroup>
                        <FormGroup
                            label="Path"
                            labelFor="path"
                            helperText="Will take the project's path if left empty."
                        >
                            <InputGroup
                                placeholder="E.g., D:\MyProjects\MyAwesomeProject (Whichever path style your OS uses)"
                                id="path"
                                type="text"
                                onChange={props.handleChange}
                                value={props.values.path}
                            />
                        </FormGroup>
                        <FormGroup
                            label="Command"
                            labelFor="cmd"
                            helperText="Will take the project path if left empty."
                        >
                            <InputGroup
                                required={true}
                                id="path"
                                type="text"
                                onChange={props.handleChange}
                                value={props.values.path}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Button
                                intent="primary"
                                text="Save Command"
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
