import { Request, Response } from "express";
import { existsSync } from "fs";


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
    const isValid =  existsSync(req.body.path);
    return res.status(200).send({
      isValid
    })
  } catch (error) {
    console.log('error:', error)
    return res.status(400).send({error: error.message})
    
  }
}