import low, { AdapterSync } from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

function uuid(a?: any) {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}

class Database {
  private static _instance: Database;
  private db = null;
  // Create Singleton by private constructor
  private constructor() {
    const adapter: AdapterSync = new FileSync("../db.json");
    this.db = low(adapter);
    this.db
      .defaults({
        projects: [],
        commands: [] // Different from commands in side a project
      })
      .write();
  }

  // Return singleton instance
  public static getInstance() {
    return this._instance || (this._instance = new this());
  }

  public get projects(): IProject[] {
    const projects = this.db.get("projects").value();
    return projects;
  }

  public addProject(project: IProject) {
    const result = this.db
      .get("projects")
      .push({ _id: uuid(), ...project })
      .write();
    return result;
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
}

export default Database.getInstance();
