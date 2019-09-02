export const hasProjectWithSameName = (projects: IProject[], newProjectName: string) => {
  const existingNames: string[] = projects.map(project => project.name.toLowerCase());
  const hasProject = existingNames.includes(newProjectName.toLowerCase());
  return hasProject;
};