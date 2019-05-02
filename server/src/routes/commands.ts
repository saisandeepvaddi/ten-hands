import express from "express";
const router = express.Router({ mergeParams: true });

import { addCommand } from "../controllers/commands";

/* 
Self Note: Use this to do REST Testing in REST Client extension in VSCode

POST http://localhost:1010/projects/1234/commands
Content-Type: application/json

{
  "name": "start",
  "cmd": "npm run start",
  "execDir": "/src",
  "pid": ""
}

 */

router.post("/", addCommand);

/*
Self Note: Use this to do REST Testing in REST Client extension in VSCode

POST http://localhost:1010/projects/1234/commands/6789
Content-Type: application/json

{
  "name": "start",
  "cmd": "npm run start",
  "execDir": "/src",
  "pid": ""
}

 */

router.post("/:commandId", addCommand);

export default router;
