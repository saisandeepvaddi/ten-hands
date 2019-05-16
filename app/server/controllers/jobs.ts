import { Request, Response } from "express";
import db from "../services/db";
import Job from "../services/job";

export function startJob(req: Request, res: Response) {
  // POST http://localhost:1010/projects/1234/jobs
  const { commandId } = req.body;
  const { projectId } = req.params;

  const command = db.getProjectCommand(projectId, commandId);

  return res.status(200).send({
    data: command
  });
}
