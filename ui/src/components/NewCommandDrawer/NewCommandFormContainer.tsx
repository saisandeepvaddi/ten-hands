import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { getYesterday } from "../../utils/general";
import { isValidPath } from "../../utils/node";
import { configAtom } from "../shared/state/atoms";
import { useProjects } from "../shared/stores/ProjectStore";
import NewCommandForm from "./NewCommandForm";

const initialCommand: IProjectCommand = {
  _id: "",
  name: "",
  execDir: "",
  cmd: "",
  lastExecutedAt: getYesterday(),
  shell: "",
  arguments: {},
};

const Container = styled.div`
  height: 100%;
  overflow: auto;
`;

interface INewCommandFormContainerProps {
  setDrawerOpen: (isOpen: boolean) => any;
}

const NewCommandFormContainer: React.FC<INewCommandFormContainerProps> =
  React.memo(({ setDrawerOpen }) => {
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
        <NewCommandForm
          initialValues={initialCommand}
          onSubmit={handleSubmit}
          customErrors={errors}
        />
      </Container>
    );
  });

export default NewCommandFormContainer;
