import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { isValidPath } from "../../utils/node";
import NewCommandForm from "../NewCommandDrawer/NewCommandForm";
import { configAtom } from "../shared/state/atoms";
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
    // const { config } = useConfig();
    const config = useRecoilValue(configAtom);

    const initialCommand: IProjectCommand = {
      name: "",
      execDir: "",
      cmd: "",
      shell: "",
      ...command,
    };
    console.log("initialCommand:", initialCommand);

    const [errors, setErrors] = useState<any>({
      path: "",
    });

    const validatePath = async (value) => {
      try {
        let error = "";

        if (!value) {
          return "";
        }
        console.log("value:", value);

        const isPathValid = await isValidPath(config, value);

        if (!isPathValid) {
          error = "This path doesn't exist. You can leave the path empty.";
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
          ...values,
        };
        console.log("updatedCommand:", updatedCommand);

        const pathError = await validatePath(updatedCommand.execDir);
        const shellError = await validatePath(updatedCommand.shell);

        if (pathError || shellError) {
          actions.setSubmitting(false);
          setErrors({
            path: pathError,
            shell: shellError,
          });
          return;
        }

        actions.setSubmitting(true);
        await updateTask(activeProject._id, command._id, updatedCommand);
        actions.setSubmitting(false);
        setDrawerOpen(false);
      } catch (error) {
        console.error(error);
        actions.setSubmitting(false);
      }
    };

    return (
      <Container>
        <NewCommandForm
          initialValues={initialCommand}
          onSubmit={handleSubmit}
          customErrors={errors}
        />
      </Container>
    );
  },
);

export default UpdateCommandForm;
