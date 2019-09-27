import { Request, Response } from "express";
import db from "../services/db";

/**
 * Controller to add new task to project
 *
 * @export
 * @param {Request} req
 * @param {string} req.params.projectId Project Id
 * @param {IProjectCommand} req.body.command Task Details
 * @param {Response} res
 * @returns
 */
export function addCommand(req: Request, res: Response) {
  try {
    const { projectId } = req.params;
    const command = req.body;

    const project = db.addCommandToProject(projectId, command);
    return res.status(200).send(project);
  } catch (error) {
    console.log("error:", error);
    return res.status(400).send({ error: error.message });
  }
}

/**
 * Controller to remove a task from project
 *
 * @export
 * @param {Request} req
 * @param {string} req.params.projectId Project Id
 * @param {string} req.params.commandId Task Id
 * @param {Response} res
 * @returns
 */
export function removeCommand(req: Request, res: Response) {
  try {
    const { projectId, commandId } = req.params;

    const project = db.removeCommandFromProject(projectId, commandId);
    return res.status(200).send(project);
  } catch (error) {
    console.log("error:", error);
    return res.status(400).send({ error: error.message });
  }
}

/**
 * Controller to reorder tasks in a project
 *
 * @export
 * @param {Request} req
 * @param {string} req.params.projectId Project Id
 * @param {IProjectCommand[]} req.body.commands Tasks List
 * @param {Response} res
 * @returns
 */
export function reorderCommands(req: Request, res: Response) {
  try {
    const { projectId } = req.params;
    const { commands } = req.body;
    if (!commands) {
      throw new Error("No commands sent");
    }
    const project = db.reorderProjectCommands(projectId, commands);
    return res.status(200).send(project);
  } catch (error) {
    console.log("error:", error);
    return res.status(400).send({ error: error.message });
  }
}
