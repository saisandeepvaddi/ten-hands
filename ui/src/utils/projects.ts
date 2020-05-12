export const hasProjectWithSameName = (
  projects: IProject[],
  newProjectName: string
): boolean => {
  const existingNames: string[] = projects.map((project) =>
    project.name.toLowerCase()
  );
  const hasProject = existingNames.includes(newProjectName.toLowerCase());
  return hasProject;
};

export const hasDifferentProjectWithSameName = (
  projects: IProject[],
  newProjectName: string,
  thisProject: IProject
): boolean => {
  const otherProjects = projects.filter(
    (project) => project._id !== thisProject._id
  );
  const existingNames: string[] = otherProjects.map((project) =>
    project.name.toLowerCase()
  );
  const hasProject = existingNames.includes(newProjectName.toLowerCase());
  return hasProject;
};
