import { Button, FileInput, FormGroup, InputGroup } from "@blueprintjs/core";
import { Formik } from "formik";
import React, { useCallback, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { isRunningInElectron } from "../../utils/electron";
import { isValidPath } from "../../utils/node";
import { hasProjectWithSameName } from "../../utils/projects";
import { configAtom } from "../shared/state/atoms";
import { useProjects } from "../shared/stores/ProjectStore";
import handleConfigFiles from "./handleConfigFiles";
import NewProjectCommands from "./NewProjectCommands";
import ProjectFileUpload from "./ProjectFileUpload";

const emptyProject: IProject = {
  _id: uuidv4(),
  name: "",
  type: "",
  commands: [],
  configFile: "",
  path: "",
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
    // const [initialProject, setInitialProject] = useState<IProject>(
    //   emptyProject
    // );
    const [configFileName, setConfigFileName] = useState("");
    const { projects, addProject } = useProjects();
    // const { config } = useConfig();
    const config = useRecoilValue(configAtom);

    const [errors, setErrors] = useState<any>({
      name: "",
      path: "",
    });

    const validateProjectName = (value) => {
      let error = "";
      if (!value) {
        error = "Project name cannot be empty";
      }

      if (hasProjectWithSameName(projects, value)) {
        error = "Project name already exists";
      }

      return error;
    };

    const validatePath = async (value) => {
      try {
        let error = "";

        const isPathValid = await isValidPath(config, value);

        if (!isPathValid) {
          error = "This path doesn't exist";
        }

        return error;
      } catch (error) {
        console.log("error:", error);
      }
    };

    const fillFormWithProjectConfig = (file: ITenHandsFile, setFieldValue) => {
      const parsedProjectData = handleConfigFiles(file);
      if (parsedProjectData !== null) {
        const {
          name: projectName,
          type,
          commands,
          configFile,
          path,
        } = parsedProjectData;
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
    const onConfigFileUpload = useCallback(
      (filePath, fileData, setFieldValue) => {
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
      },
      []
    );

    const onProjectFileChange = useCallback((e, setFieldValue) => {
      e.preventDefault();

      const reader = new FileReader();
      const file = e.target.files[0];

      reader.onloadend = () => {
        console.log("file:", file);
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
    const submitProject = async (values, actions) => {
      // console.info("values:", values);
      const nameError = validateProjectName(values.name);
      const pathError = !values.path
        ? "Project path cannot be empty."
        : await validatePath(values.path);
      const shellError = !values.shell ? "" : await validatePath(values.shell);
      if (nameError || pathError || shellError) {
        actions.setSubmitting(false);
        setErrors({
          name: nameError,
          path: pathError,
          shell: shellError,
        });
        return;
      }

      try {
        actions.setSubmitting(true);
        await addProject(values);
        actions.resetForm();
        setDrawerOpen(false);
      } catch (error) {
        console.error(error);
      } finally {
        actions.setSubmitting(false);
        setErrors({
          name: "",
          path: "",
          shell: "",
        });
      }
    };

    return (
      <Container>
        <Formik
          initialValues={emptyProject}
          onSubmit={submitProject}
          render={({
            handleSubmit,
            handleChange,
            values,
            setFieldValue,
            isSubmitting,
          }) => (
            <form data-testid="new-project-form" onSubmit={handleSubmit}>
              <FormGroup
                label="Project Config File"
                helperText="Currently supports only package.json. You can create a project without this."
              >
                {isRunningInElectron() ? (
                  <ProjectFileUpload
                    configFileName={configFileName}
                    onConfigFileUpload={(fileName, fileData) =>
                      onConfigFileUpload(fileName, fileData, setFieldValue)
                    }
                  />
                ) : (
                  <FileInput
                    text={configFileName || "Choose file..."}
                    inputProps={{
                      id: "configFile",
                    }}
                    fill={true}
                    onInputChange={(e) => onProjectFileChange(e, setFieldValue)}
                  />
                )}
              </FormGroup>
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
                  onChange={handleChange}
                  value={values.name}
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
                      Absolute path to the project directory. Will be
                      auto-filled if <i>tenHands.path</i> exists in
                      package.json.
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
                  onChange={handleChange}
                  value={values.path}
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
                  onChange={handleChange}
                  value={values.shell}
                />
              </FormGroup>
              {/* <FormGroup
                            label="Project Type"
                            labelFor="type"
                            helperText="Will be auto-filled if it can be determined from package.json."
                        >
                            <HTMLSelect fill={true} id="type" onChange={handleChange} value={values.type}>
                                <option value="">Select Project Type</option>
                                <option value="nodejs">NodeJS</option>
                                <option value="other">Other</option>
                            </HTMLSelect>
                        </FormGroup> */}
              <FormGroup
                label="Tasks"
                labelFor="commands"
                helperText="Will be auto-filled if available in package.json. Otherwise, you can add tasks after creating the project."
              >
                <NewProjectCommands
                  commands={values.commands}
                  setCommands={(commands: IProjectCommand[]) =>
                    setFieldValue("commands", commands)
                  }
                />
              </FormGroup>
              <FormGroup>
                <Button
                  data-testid="save-project-button"
                  intent="primary"
                  text="Save Project"
                  type="submit"
                  loading={isSubmitting}
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
