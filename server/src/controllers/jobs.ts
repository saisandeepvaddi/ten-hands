import { Request, Response } from "express";
import db from "../services/db";

enum JobStatus {
  RUNNING,
  STOPPED
}

class Job {
  private readonly _id: string;
  private readonly socketId: string;
  private status: JobStatus;
  constructor(id: string) {
    this._id = id;
  }

  start() {
    // Create a socket room
  }

  kill() {
    // Destroy room
    // Kill Process
  }
}

export function startJob(req: Request, res: Response) {
  // POST http://localhost:1010/projects/1234/jobs/5678
  const { id } = req.params;
  console.log("req.params:", req.params);
  console.log("req.body:", req.body);
  return res.sendStatus(200);
}
