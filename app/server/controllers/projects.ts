import { Request, Response } from "express";
import db from "../services/db";

export function getAllProjects(req: Request, res: Response) {
  const projects = db.getProjects();
  return res.status(200).send(projects);
}

export function addProject(req: Request, res: Response) {
  const project = db.addProject(req.body);
  return res.status(200).send(project);
}

export function deleteProject(req: Request, res: Response) {
  const { projectId } = req.params;
  const project = db.deleteProject(projectId);
  return res.status(200).send(project);
}

export function reorderProjects(req: Request, res: Response) {
  const { projectIds } = req.body;
  const reorderProjectIds = db.reorderProjects(projectIds);
  return res.status(200).send(reorderProjectIds);
}
