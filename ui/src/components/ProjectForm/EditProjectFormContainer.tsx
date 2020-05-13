import React from "react";
import EditProjectForm from "./EditProjectForm";
import { validateEditProjectForm } from "./project-form-validators";
import { useProjects } from "../shared/stores/ProjectStore";
import { useConfig } from "../shared/stores/ConfigStore";

interface IEditProjectFormContainerProps {
  activeProject: IProject;
  setDrawerOpen: (isOpen: boolean) => any;
}

const EditProjectFormContainer: React.FC<IEditProjectFormContainerProps> = ({
  activeProject,
  setDrawerOpen,
}) => {
  const { projects, updateProject } = useProjects();
  const { config } = useConfig();

  const initialValues: IProject = {
    ...activeProject,
  };

  const onSubmit = async (values: IProject): Promise<any> => {
    try {
      console.log("values:", values);
      await updateProject(activeProject._id, values);
      setDrawerOpen(false);
    } catch (error) {
      console.log(`onSubmit error: `, error);
    }
  };

  const validate = async (values: IProject): Promise<Partial<IProject>> => {
    const errors = await validateEditProjectForm(
      values,
      projects,
      activeProject,
      config
    );
    return errors;
  };

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
