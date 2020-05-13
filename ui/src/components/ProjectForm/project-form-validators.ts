import { hasDifferentProjectWithSameName } from "../../utils/projects";
import { isValidPath } from "../../utils/node";

export async function validateEditProjectForm(
  values: IProject,
  allProjects: IProject[],
  thisProject: IProject,
  config: IConfig
): Promise<Partial<IProject>> {
  const errors: Partial<IProject> = {};
  if (!values.name) {
    errors.name = "Cannot be empty.";
  } else if (
    hasDifferentProjectWithSameName(allProjects, values.name, thisProject)
  ) {
    errors.name = "Project name already exists.";
  }

  if (!values.path) {
    errors.path = "Cannot be empty.";
  } else if (!(await isValidPath(config, values.path))) {
    errors.path = "This path doesn't exist.";
  }

  if (values.shell && !(await isValidPath(config, values.shell))) {
    errors.shell = "This path doesn't exist.";
  }

  return errors;
}
