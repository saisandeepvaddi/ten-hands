import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import { Formik } from "formik";
import React, { useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { isValidPath } from "../../utils/node";
import { useConfig } from "../shared/stores/ConfigStore";
import { useProjects } from "../shared/stores/ProjectStore";

const Container = styled.div`
  height: 100%;
  overflow: auto;
`;

interface IUpdateCommandFormProps {
  setDrawerOpen: (isOpen: boolean) => any;
  command: IProjectCommand;
}

const UpdateCommandForm: React.FC<IUpdateCommandFormProps> = React.memo(
  ({ setDrawerOpen, command }) => {
    const { activeProject, updateTask } = useProjects();
    const { config } = useConfig();

    const initialCommand: IProjectCommand = {
      _id: "",
      name: "",
      execDir: "",
      cmd: "",
      ...command
    };
    console.log("initialCommand:", initialCommand);

    const [errors, setErrors] = useState<any>({
      path: ""
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
          error =
            "This path doesn't exist. You can leave the path empty to run task in project's path.";
        }

        return error;
      } catch (error) {
        console.log("error:", error);
      }
    };

    const handleSubmit = async (values, actions): Promise<any> => {
      try {
        const updatedCommand: IProjectCommand = {
          ...command,
          ...values
        };
        console.log("updatedCommand:", updatedCommand);
        const pathError = await validateCommandPath(updatedCommand.execDir);
        if (pathError) {
          actions.setSubmitting(false);
          setErrors({
            path: pathError
          });
          return;
        }
        actions.setSubmitting(true);
        await updateTask(activeProject._id!, command._id, updatedCommand);
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
              <FormGroup
                label="Name"
                labelFor="name"
                helperText="A short name for your task."
              >
                <InputGroup
                  required={true}
                  placeholder="E.g., Start DB"
                  id="name"
                  type="text"
                  onChange={props.handleChange}
                  value={props.values.name}
                  autoFocus
                />
              </FormGroup>

              <FormGroup
                label="Task"
                labelFor="cmd"
                helperText="Actual task to run in terminal."
              >
                <InputGroup
                  required={true}
                  id="cmd"
                  type="text"
                  placeholder="e.g., yarn test"
                  onChange={props.handleChange}
                  value={props.values.cmd}
                />
              </FormGroup>
              <FormGroup
                label="Path (optional)"
                labelFor="execDir"
                intent={errors.path ? "danger" : "none"}
                helperText={
                  errors.path ? (
                    errors.path
                  ) : (
                    <span>
                      Use this{" "}
                      <b>
                        <i>only</i>
                      </b>{" "}
                      when task path is different from the project path.
                    </span>
                  )
                }
              >
                <InputGroup
                  placeholder="E.g., Absolute path where to execute the task."
                  id="execDir"
                  type="text"
                  onChange={props.handleChange}
                  value={props.values.execDir}
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
  }
);

export default UpdateCommandForm;
