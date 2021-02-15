import React from "react";
import { FormGroup, InputGroup, Button } from "@blueprintjs/core";
import { isRunningInElectron } from "../../utils/electron";
import { useFormik } from "formik";

interface IProjectFormProps {
  initialValues: IProject;
  onSubmit: (values: IProject) => Promise<any>;
  validate: (values: IProject) => Promise<Partial<IProject>>;
}

const ProjectForm: React.FC<IProjectFormProps> = ({
  initialValues,
  onSubmit,
  validate,
}) => {
  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  });

  const {
    errors,
    handleSubmit,
    isValid,
    isSubmitting,
    getFieldProps,
    dirty,
  } = formik;

  return (
    <React.Fragment>
      <form data-testid="new-project-form" onSubmit={handleSubmit}>
        <FormGroup
          label="Project Name"
          labelFor="name"
          intent={errors.name ? "danger" : "none"}
          helperText={
            errors.name
              ? errors.name
              : "Will be auto-filled if you are using a package.json. Otherwise, choose a name."
          }
        >
          <InputGroup
            id="name"
            type="text"
            required={true}
            placeholder="My Awesome Project"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            {...getFieldProps("name")}
          />
        </FormGroup>
        <FormGroup
          label="Project Path"
          labelFor="path"
          intent={errors.path ? "danger" : "none"}
          helperText={
            errors.path ? (
              errors.path
            ) : isRunningInElectron() ? (
              "Absolute path to the project directory. Will be auto-filled if a package.json uploaded."
            ) : (
              <span>
                Absolute path to the project directory. Will be auto-filled if{" "}
                <i>tenHands.path</i> exists in package.json.
              </span>
            )
          }
        >
          <InputGroup
            required={true}
            id="path"
            type="text"
            placeholder={
              navigator.platform.toLowerCase() === "win32"
                ? "D:\\AllProjects\\MyProjectDirectory"
                : "/home/all-projects/my-project"
            }
            {...getFieldProps("path")}
          />
        </FormGroup>
        <FormGroup
          label="Shell (Optional)"
          labelFor="shell"
          intent={errors.shell ? "danger" : "none"}
          helperText={
            errors.shell ? (
              errors.shell
            ) : (
              <span>
                Absolute path to the shell. <b>Default:</b>{" "}
                <pre className="pre-inline">cmd.exe</pre> on Windows and{" "}
                <pre className="pre-inline">/bin/sh</pre> on unix.
              </span>
            )
          }
        >
          <InputGroup
            id="shell"
            type="text"
            placeholder={
              navigator.platform.toLowerCase() === "win32"
                ? "C:\\Windows\\System32\\cmd.exe"
                : "/bin/sh"
            }
            {...getFieldProps("shell")}
          />
        </FormGroup>
        <FormGroup>
          <Button
            data-testid="save-project-button"
            intent="primary"
            text="Save Project"
            type="submit"
            loading={isSubmitting}
            disabled={!isValid || !dirty}
            large={true}
          />
        </FormGroup>
      </form>
    </React.Fragment>
  );
};

export default ProjectForm;
