import { Request, Response } from "express";
import { existsSync } from "fs";
import db from "../services/db";

// Have to use require because it's type-definition doesn't have function that allows path
// Do not want to update node_module's file.
// tslint:disable-next-line: no-var-requires
const getRepoInfo = require("git-repo-info");

/**
 * Returns if a path is valid and exists in file system or not
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export function isValidPath(req: Request, res: Response) {
  try {
    const isValid = existsSync(req.body.path);
    return res.status(200).send({
      isValid,
    });
  } catch (error) {
    console.log("error:", error);
    return res.status(400).send({ error: error.message });
  }
}

/**
 * Returns git repo info at the given path
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export function getGitInfo(req: Request, res: Response) {
  try {
    const { path } = req.body;
    if (!path) {
      throw new Error("Invalid Path");
    }

    const gitInfo = getRepoInfo(path);
    return res.status(200).send(gitInfo);
  } catch (error) {
    console.log("error:", error);
    return res.status(400).send({ error: error.message });
  }
}

/**
 * Returns git repo info at the given path
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
export function updateRunningTaskCount(req: Request, res: Response) {
  try {
    const { count } = req.body;
    console.log("count:", count);
    const newRunningTaskCount = db.setRunningTaskCount(count);
    return res
      .status(200)
      .send(`New Running task count: ${newRunningTaskCount}`);
  } catch (error) {
    console.log("error:", error);
    return res.status(400).send({ error: error.message });
  }
}
