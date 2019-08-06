import { Request, Response } from "express";
import db from "../services/db";

export function addCommand(req: Request, res: Response) {
  const { projectId } = req.params;
  const command = req.body;

  const project = db.addCommandToProject(projectId, command);
  return res.status(200).send(project);
}

export function removeCommand(req: Request, res: Response) {
  const { projectId, commandId } = req.params;

  const project = db.removeCommandFromProject(projectId, commandId);
  return res.status(200).send(project);
}

export function reorderCommands(req: Request, res: Response) {
  const { projectId } = req.params;
  const { commands } = req.body;
  const project = db.reorderProjectCommands(projectId, commands);
  return res.status(200).send(project);
}
