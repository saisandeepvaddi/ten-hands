import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import { Formik } from "formik";
import React, { useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { isValidPath } from "../../utils/node";
import { useProjects } from "../shared/stores/ProjectStore";
import { getYesterday } from "../../utils/general";
import { useRecoilValue } from "recoil";
import { configAtom } from "../shared/state/atoms";

const initialCommand: IProjectCommand = {
  _id: "",
  name: "",
  execDir: "",
  cmd: "",
  lastExecutedAt: getYesterday(),
  shell: "",
};

const Container = styled.div`
  height: 100%;
  overflow: auto;
`;

interface INewProjectFormProps {
  setDrawerOpen: (isOpen: boolean) => any;
}

const NewProjectForm: React.FC<INewProjectFormProps> = React.memo(
  ({ setDrawerOpen }) => {
    const { activeProject, addTask } = useProjects();
    // const { config } = useConfig();
    const config = useRecoilValue(configAtom);

    const [errors, setErrors] = useState<any>({
      path: "",
    });

    const validatePath = async (value) => {
      try {
        let error = "";
        if (!value) {
          return "";
        }
        const isPathValid = await isValidPath(config, value);

        if (!isPathValid) {
          error = "This path doesn't exist. You can leave path empty.";
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
        const pathError = await validatePath(newCommand.execDir);
        const shellError = await validatePath(newCommand.shell);
        if (pathError || shellError) {
          actions.setSubmitting(false);
          setErrors({
            path: pathError,
            shell: shellError,
          });
          return;
        }
        actions.setSubmitting(true);
        await addTask(activeProject._id, newCommand);
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
          render={(props) => (
            <form onSubmit={props.handleSubmit} data-testid="new-task-form">
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
                  // eslint-disable-next-line jsx-a11y/no-autofocus
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
              <FormGroup
                label="Shell (optional)"
                labelFor="shell"
                intent={errors.shell ? "danger" : "none"}
                helperText={
                  errors.shell ? (
                    errors.shell
                  ) : (
                    <span>
                      Absolute path to the shell. Overrides project&apos;s shell
                      or global shell.
                    </span>
                  )
                }
              >
                <InputGroup
                  placeholder={
                    navigator.platform.toLowerCase() === "win32"
                      ? "C:\\Windows\\System32\\cmd.exe"
                      : "/bin/sh"
                  }
                  id="shell"
                  type="text"
                  onChange={props.handleChange}
                  value={props.values.shell}
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

export default NewProjectForm;
