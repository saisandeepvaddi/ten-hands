import { Request, Response } from "express";
import db from "../services/db";

export function getAllProjects(req: Request, res: Response) {
  const projects = db.projects;

  return res.status(200).send({
    data: projects
  });
}

export function addProject(req: Request, res: Response) {
  const project = db.addProject(req.body);
  return res.status(200).send({
    data: project
  });
}
