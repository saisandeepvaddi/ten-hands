import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import Axios, { AxiosResponse } from "axios";
import { Formik } from "formik";
import React, { useCallback } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { useConfig } from "../shared/Config";
import { useProjects } from "../shared/Projects";

const initialCommand: IProjectCommand = {
    _id: "",
    name: "",
    execDir: "",
    cmd: "",
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

    const handleSubmit = useCallback(
        (values, actions) => {
            const saveCommand = async (newCommand: IProjectCommand): Promise<any> => {
                try {
                    actions.setSubmitting(true);
                    const responseData: AxiosResponse = await Axios({
                        timeout: 5000,
                        method: "post",
                        baseURL: `http://localhost:${config.port}`,
                        url: `projects/${activeProject._id}/commands`,
                        data: newCommand,
                    });
                    actions.setSubmitting(false);
                    const updatedProject = responseData.data;
                    console.log("updatedProject:", updatedProject);
                    await updateProjects();
                    setDrawerOpen(false);
                    setActiveProject(updatedProject);
                } catch (error) {
                    console.error(error);
                    actions.setSubmitting(false);
                }
            };
            const newCommand = {
                ...values,
                _id: uuidv4(),
            };
            saveCommand(newCommand);
        },
        [setActiveProject, setDrawerOpen, updateProjects],
    );

    return (
        <Container>
            <Formik
                initialValues={initialCommand}
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
                            labelFor="execDir"
                            helperText="Will take the project's path if left empty."
                        >
                            <InputGroup
                                placeholder="E.g., Absolute path where to execute the command."
                                id="execDir"
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
                                id="cmd"
                                type="text"
                                placeholder="Actual Command. e.g., yarn test"
                                onChange={props.handleChange}
                                value={props.values.cmd}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Button
                                data-testid="save-command-button"
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
