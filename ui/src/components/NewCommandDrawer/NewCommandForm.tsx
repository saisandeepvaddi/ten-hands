import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import { Formik } from "formik";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { isValidPath } from "../../utils/node";
import { saveTaskInDb } from "../shared/API";
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
    const { updateProjects, setActiveProject, activeProject, addTask } = useProjects();
    const { config } = useConfig();

    const [errors, setErrors] = useState<any>({
        path: "",
    });

    const validateCommandPath = async value => {
        try {
            let error = "";

            if (!value) {
                return "";
            }
            console.log("value:", value);

            const isPathValid = await isValidPath(config, value);

            if (!isPathValid) {
                error = "This path doesn't exist. You can leave the path empty to run task in project's path.";
            }

            return error;
        } catch (error) {
            console.log("error:", error);
        }
    };

    const handleSubmit = async (values, actions): Promise<any> => {
        try {
            const newCommand: IProjectCommand = {
                ...values,
                _id: uuidv4(),
            };
            const pathError = await validateCommandPath(newCommand.execDir);
            if (pathError) {
                actions.setSubmitting(false);
                setErrors({
                    path: pathError,
                });
                return;
            }
            actions.setSubmitting(true);
            await addTask(activeProject._id!, newCommand);
            actions.setSubmitting(false);
            setDrawerOpen(false);
        } catch (error) {
            console.error(error);
            actions.setSubmitting(false);
        }
    };

    return (
        <Container>
            <Formik
                initialValues={initialCommand}
                onSubmit={handleSubmit}
                render={props => (
                    <form onSubmit={props.handleSubmit}>
                        <FormGroup label="Name" labelFor="name" helperText="A short name for your task.">
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
                            intent={errors.path ? "danger" : "none"}
                            helperText={errors.path ? errors.path : "Will take the project's path if left empty."}
                        >
                            <InputGroup
                                placeholder="E.g., Absolute path where to execute the task."
                                id="execDir"
                                type="text"
                                onChange={props.handleChange}
                                value={props.values.path}
                            />
                        </FormGroup>
                        <FormGroup label="Task" labelFor="cmd" helperText="Will take the project path if left empty.">
                            <InputGroup
                                required={true}
                                id="cmd"
                                type="text"
                                placeholder="Actual Task. e.g., yarn test"
                                onChange={props.handleChange}
                                value={props.values.cmd}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Button
                                data-testid="save-task-button"
                                intent="primary"
                                text="Save Task"
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
