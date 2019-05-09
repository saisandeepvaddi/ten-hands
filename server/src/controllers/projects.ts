import { Request, Response } from "express";
import db from "../services/db";

export function getAllProjects(req: Request, res: Response) {
  const projects = db.projects;

  return res.status(200).send(projects);
}

export function addProject(req: Request, res: Response) {
  console.log("req.body:", req.body);
  const project = db.addProject(req.body);
  return res.status(200).send(project);
}

export function deleteProject(req: Request, res: Response) {
  const { projectId } = req.params;
  const project = db.deleteProject(projectId);
  return res.status(200).send(project);
}
