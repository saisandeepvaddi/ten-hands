import { Request, Response } from "express";
import db from "../services/db";

export function addCommand(req: Request, res: Response) {
  const { projectId } = req.params;
  const command = req.body;

  const project = db.addCommandToProject(projectId, command);
  return res.status(200).send(project);
}
