import { atom, selector } from "recoil";
import { IProject } from "../../types";

export const projectsAtom = atom<IProject[]>({
  key: "projects",
  default: [],
});

export const activeProjectIDAtom = atom<string>({
  key: "activeProjectID",
  default: null,
});

export const activeProjectAtom = selector<IProject>({
  key: "activeProject",
  get: ({ get }) => {
    const activeProjectID = get(activeProjectIDAtom);
    const allProjects = get(projectsAtom);
    if (!activeProjectID && allProjects.length > 0) {
      return allProjects[0];
    }
    const activeProject = allProjects.find(
      (project) => project._id === activeProjectID
    );
    return activeProject;
  },
});
