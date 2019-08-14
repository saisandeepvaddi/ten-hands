import low, { AdapterSync } from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { v4 as uuidv4 } from "uuid";
import { CONFIG_FILES } from "../../shared/config";

class Database {
  private static _instance: Database;
  private db = null;
  // Create Singleton by private constructor
  private constructor() {
    const adapter: AdapterSync = new FileSync(CONFIG_FILES.dbFile);
    this.db = low(adapter);
    this.db
      .defaults({
        projectsOrder: [],
        projects: []
      })
      .write();
  }

  // Return singleton instance
  public static getInstance() {
    return this._instance || (this._instance = new this());
  }

  public reorderProjects(projectIds: string[]) {
    this.db.set("projectsOrder", projectIds).write();
    return projectIds;
  }

  public getProjects(): IProject[] {
    const projects: IProject[] = this.db.get("projects").value() || [];
    let projectsOrder = this.db.get("projectsOrder").value() || [];

    if (projects.length === 0) {
      return projects;
    }

    // In case, ten-hands is updated, there will not be correct projectsOrder[] in db.json
    if (
      projectsOrder.length === 0 ||
      projectsOrder.length !== projects.length
    ) {
      const defaultOrder: string[] = projects.map(project => project._id);

      // update order array for now while returning in default order
      this.reorderProjects(defaultOrder);
      return projects;
    }

    // To get project in order
    let projectsMap = {};

    projects.map(project => {
      projectsMap[project._id] = project;
    });

    const orderedProjects = projectsOrder.map((projectId: string) => {
      return projectsMap[projectId];
    });

    return orderedProjects;
  }

  public addProject(project: IProject) {
    // Create IDs for commands submitted
    const commands = project.commands.map(command => {
      return {
        _id: uuidv4(),
        ...command
      };
    });
    const projectWithUpdatedCommands = {
      ...project,
      commands
    };
    const newProject = {
      _id: uuidv4(),
      ...projectWithUpdatedCommands
    };
    this.db
      .get("projects")
      .push(newProject)
      .write();
    return newProject;
  }

  public deleteProject(projectId: string) {
    const result = this.db
      .get("projects")
      .remove({ _id: projectId })
      .write();
    return result;
  }

  public getProject(id: string): IProject {
    const project = this.db
      .get("projects")
      .find({ _id: id })
      .value();
    return project;
  }

  public addCommandToProject(projectId: string, command: IProjectCommand) {
    this.db
      .get("projects")
      .find({ _id: projectId })
      .get("commands")
      .push({ ...command })
      .write();
    const project = this.getProject(projectId);
    return project;
  }

  public removeCommandFromProject(projectId: string, commandId: string) {
    this.db
      .get("projects")
      .find({ _id: projectId })
      .get("commands")
      .remove({ _id: commandId })
      .write();
    const project = this.getProject(projectId);
    return project;
  }

  public getProjectCommand(projectId: string, commandId: string) {
    const command = this.db
      .get("projects")
      .find({ _id: projectId })
      .get("commands")
      .find({ _id: commandId })
      .value();
    return command;
  }

  public reorderProjectCommands(
    projectId: string,
    commands: IProjectCommand[]
  ) {
    this.db
      .get("projects")
      .find({ _id: projectId })
      .set("commands", commands)
      .write();
    const project = this.getProject(projectId);
    return project;
  }
}

export default Database.getInstance();
