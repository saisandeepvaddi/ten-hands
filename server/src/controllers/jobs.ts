import { Request, Response } from "express";
import db from "../services/db";
import { v4 as uuid } from "uuid";

class Job implements IJob {
  _id?: string;
  name: string;
  pid: number;
  type: string;
  path: string;
  createdAt: Date;
  constructor(command: IProjectCommand) {
    // Pass a command to create Job
    this._id = uuid();
  }
  start(): number {
    throw new Error("Method not implemented.");
  }
  kill(): boolean {
    throw new Error("Method not implemented.");
  }
}

export function startJob(req: Request, res: Response) {
  // POST http://localhost:1010/projects/1234/jobs
  const { commandId } = req.body;
  const { projectId } = req.params;

  const command = db.getProjectCommand(projectId, commandId);
  console.log("projectId, commandId:", projectId, commandId);
  console.log("command:", command);

  return res.status(200).send({
    data: command
  });
}
