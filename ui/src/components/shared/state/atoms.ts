import { atom } from "recoil";

export const activeProjectAtom = atom<IProject>({
  key: "activeProject",
  default: {
    _id: "",
    name: "",
    type: "",
    path: "",
    shell: "",
    configFile: "",
    taskSortOrder: "name-asc",
    commands: [],
  },
});

export const projectsAtom = atom({
  key: "projects",
  default: [],
});
