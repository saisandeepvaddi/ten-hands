import express from "express";
const router = express.Router({ mergeParams: true });

import { addCommand, removeCommand } from "../controllers/commands";

/* 
Self Note: Use this to do REST Testing in REST Client extension in VSCode

POST http://localhost:1010/projects/75034ae2-c231-497d-a3d6-adb7048bb696/commands
Content-Type: application/json

{
 "name": "start",
 "cmd": "node /Programming/ten-hands/server/src/functions.js",
 "execDir": "/src",
 "pid": ""
}

 */

router.post("/", addCommand);

router.delete("/:commandId", removeCommand);

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

// router.post("/:commandId", addCommand);

export default router;
