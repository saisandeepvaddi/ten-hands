import low, { AdapterSync } from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import Memory from "lowdb/adapters/Memory";
import { v4 as uuidv4 } from "uuid";
import { CONFIG_FILES } from "../../shared/config";
import { areTwoArraysEqual } from "./utils";

/**
 * DataBase Service Class.
 * Manages db.json file data in ./<user_home>/.ten-hands.
 *
 * @class Database
 */
class Database {
  private static _instance: Database;
  private db = null;
  /**
   * Creates an instance of Database.
   * @private
   * @memberof Database
   */
  private constructor() {
    console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
    const adapter: AdapterSync =
      process.env.NODE_ENV === "test"
        ? new Memory(CONFIG_FILES.dbFile)
        : new FileSync(CONFIG_FILES.dbFile);
    this.db = low(adapter);
    this.db
      .defaults({
        projectsOrder: [],
        projects: []
      })
      .write();
  }

  /**
   * Returns singleton instance of Database
   *
   * @static
   * @returns {Database}
   * @memberof Database
   */
  public static getInstance(): Database {
    return this._instance || (this._instance = new this());
  }

  /**
   *
   *
   * @param {string[]} projectIds Ordered Project Ids.
   * @returns {string[]}
   * @memberof Database
   */
  public reorderProjects(projectIds: string[]): string[] {
    this.db.set("projectsOrder", projectIds).write();
    return projectIds;
  }

  /**
   * Returns list of projects stored in db.json file.
   * The projects returned in the order provided in projectsOrder property in db.json file.
   *
   * @returns {IProject[]}
   * @memberof Database
   */
  public getProjects(): IProject[] {
    const projects: IProject[] = this.db.get("projects").value() || [];
    let projectsOrder = this.db.get("projectsOrder").value() || [];

    if (projects.length === 0) {
      // Seems there are some inconsistencies when updating the versions. When projects are deleted, the projects order doesn't match.
      // Shold not be the case generally.
      if (projectsOrder.length !== 0) {
        this.reorderProjects([]);
      }
      return projects;
    }

    const projectIds = projects.map((project: IProject) => project._id);
    const areProjectsAndProjectsOrderSame = areTwoArraysEqual(
      projectIds,
      projectsOrder
    );

    // In case, ten-hands is updated, there will not be correct projectsOrder[] in db.json
    // So, create a default order from the existing project
    if (
      projectsOrder.length === 0 ||
      projectsOrder.length !== projects.length ||
      !areProjectsAndProjectsOrderSame
    ) {
      const defaultOrder: string[] = projects.map(project => project._id);

      // Update projectsOrder array for now while returning in default order
      // Useful to automatically create order when users update to new version of ten-hands
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

  /**
   * Adds new project to database.
   *
   * @param {IProject} project
   * @returns {IProject} Created new project.
   * @memberof Database
   */
  public addProject(project: IProject): IProject {
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

    const newProject: IProject = {
      _id: uuidv4(),
      ...projectWithUpdatedCommands
    };

    this.db
      .get("projects")
      .push(newProject)
      .write();

    this.db
      .get("projectsOrder")
      .push(newProject._id)
      .write();

    return newProject;
  }

  /**
   * Deletes project with projectId from database
   *
   * @param {string} projectId
   * @returns {IProject[]} Updated list of projects
   * @memberof Database
   */
  public deleteProject(projectId: string): IProject[] {
    const result = this.db
      .get("projects")
      .remove({ _id: projectId })
      .write();

    this.db
      .get("projectsOrder")
      .remove(projectId)
      .write();

    return result;
  }

  /**
   * Get a specific project with id
   *
   * @param {string} id Project Id
   * @returns {IProject} Project
   * @memberof Database
   */
  public getProject(id: string): IProject {
    const project = this.db
      .get("projects")
      .find({ _id: id })
      .value();
    return project;
  }

  /**
   * Adds a command to existing project
   *
   * @param {string} projectId Existing project id
   * @param {IProjectCommand} command New Project Task (Commands will be renamed in code in next versions)
   * @returns {IProject} Updated project
   * @memberof Database
   */
  public addCommandToProject(
    projectId: string,
    command: IProjectCommand
  ): IProject {
    this.db
      .get("projects")
      .find({ _id: projectId })
      .get("commands")
      .push({ ...command })
      .write();
    const project = this.getProject(projectId);
    return project;
  }

  /**
   * Removes a task from project.
   *
   * @param {string} projectId Project Id
   * @param {string} commandId Task Id
   * @returns {IProject} Updated Project
   * @memberof Database
   */
  public removeCommandFromProject(
    projectId: string,
    commandId: string
  ): IProject {
    this.db
      .get("projects")
      .find({ _id: projectId })
      .get("commands")
      .remove({ _id: commandId })
      .write();
    const project = this.getProject(projectId);
    return project;
  }

  /**
   * Get a specific Task from a project.
   *
   * @param {string} projectId Project Id
   * @param {string} commandId Task Id
   * @returns {IProjectCommand} Requested Command
   * @memberof Database
   */
  public getProjectCommand(
    projectId: string,
    commandId: string
  ): IProjectCommand {
    const command = this.db
      .get("projects")
      .find({ _id: projectId })
      .get("commands")
      .find({ _id: commandId })
      .value();
    return command;
  }

  /**
   * Reorders the order of Tasks display in Project View.
   *
   * @param {string} projectId Project View
   * @param {IProjectCommand[]} commands Ordered Commands
   * @returns {IProject} Updated Project
   * @memberof Database
   */
  public reorderProjectCommands(
    projectId: string,
    commands: IProjectCommand[]
  ): IProject {
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
