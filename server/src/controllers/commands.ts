import { Request, Response } from "express";
import db from "../services/db";

export function addCommand(req: Request, res: Response) {
  return res.status(200).send({
    body: req.body,
    params: req.params
  });
}
