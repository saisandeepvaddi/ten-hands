import React, { useCallback, useMemo } from "react";
import EditProjectForm from "./EditProjectForm";
import { validateEditProjectForm } from "./project-form-validators";
import { useProjects } from "../shared/stores/ProjectStore";
import { useRecoilValue } from "recoil";
import { configAtom } from "../shared/state/atoms";

interface IEditProjectFormContainerProps {
  activeProject: IProject;
  setDrawerOpen: (isOpen: boolean) => any;
}

const EditProjectFormContainer: React.FC<IEditProjectFormContainerProps> = ({
  activeProject,
  setDrawerOpen,
}) => {
  const { projects, updateProject } = useProjects();
  // const { config } = useConfig();
  const config = useRecoilValue(configAtom);

  const initialValues: IProject = useMemo(
    () => ({
      ...activeProject,
    }),
    [activeProject]
  );

  const onSubmit = useCallback(
    async (values: IProject): Promise<any> => {
      try {
        await updateProject(values._id, values);
        setDrawerOpen(false);
      } catch (error) {
        console.log(`onSubmit error: `, error);
      }
    },
    [updateProject, setDrawerOpen]
  );

  const validate = useCallback(
    async (values: IProject): Promise<Partial<IProject>> => {
      const errors = await validateEditProjectForm(
        values,
        projects,
        activeProject,
        config
      );
      return errors;
    },
    [activeProject, config, projects]
  );

  const formProps = React.useMemo(
    () => ({
      initialValues,
      validate,
      onSubmit,
    }),
    [initialValues, validate, onSubmit]
  );

  return (
    <React.Fragment>
      <EditProjectForm {...formProps} />
    </React.Fragment>
  );
};

export default EditProjectFormContainer;
