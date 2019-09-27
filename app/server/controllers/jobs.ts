import { Request, Response } from "express";
import db from "../services/db";

export function startJob(req: Request, res: Response) {
  try {
    const { commandId } = req.body;
    const { projectId } = req.params;

    const command = db.getProjectCommand(projectId, commandId);

    return res.status(200).send({
      data: command
    });
  } catch (error) {
    console.log("error:", error);
    return res.status(400).send({ error: error.message });
  }
}
