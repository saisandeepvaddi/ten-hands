import { Request, Response } from "express";
import db from "../services/db";

/**
 * Returns a list of all projects in database
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export function getAllProjects(req: Request, res: Response) {
  try {
    const projects = db.getProjects();
    return res.status(200).send(projects);
  } catch (error) {
    console.log("error:", error);
    return res.status(400).send({ error: error.message });
  }
}

/**
 * Adds a new project to database
 *
 * @export
 * @param {Request} req
 * @param {IProject} req.body New Project Object
 * @param {Response} res
 * @returns
 */
export function addProject(req: Request, res: Response) {
  try {
    const project = db.addProject(req.body);
    return res.status(200).send(project);
  } catch (error) {
    console.log("error:", error);
    return res.status(400).send({ error: error.message });
  }
}

/**
 * Deletes a project from database
 *
 * @export
 * @param {Request} req
 * @param {string} req.params.projectId Project Id
 * @param {Response} res
 * @returns
 */
export function deleteProject(req: Request, res: Response) {
  try {
    const { projectId } = req.params;
    const project = db.deleteProject(projectId);
    return res.status(200).send(project);
  } catch (error) {
    console.log("error:", error);
    return res.status(400).send({ error: error.message });
  }
}

/**
 * Reorders project list when user updates projects order on UI
 *
 * @export
 * @param {Request} req
 * @param {string[]} req.body.projectIds Project Ids
 * @param {Response} res
 * @returns
 */
export function reorderProjects(req: Request, res: Response) {
  try {
    const { projectIds } = req.body;
    const reorderProjectIds = db.reorderProjects(projectIds);
    return res.status(200).send(reorderProjectIds);
  } catch (error) {
    console.log("error:", error);
    return res.status(400).send({ error: error.message });
  }
}
