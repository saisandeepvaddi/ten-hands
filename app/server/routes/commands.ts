import express from "express";

import {
  addCommand,
  updateCommand,
  removeCommand,
  reorderCommands,
} from "../controllers/commands";
const router = express.Router({ mergeParams: true });

/* 
Self Note: Use this to do REST Testing in REST Client extension in VSCode

POST http://localhost:5010/projects/75034ae2-c231-497d-a3d6-adb7048bb696/commands
Content-Type: application/json

{
 "name": "start",
 "cmd": "node /Programming/ten-hands/server/src/functions.js",
 "execDir": "/src",
 "pid": ""
}

 */

router.post("/reorder", reorderCommands);

router.post("/", addCommand);

router.delete("/:commandId", removeCommand);

router.put("/:commandId", updateCommand);

/*
Self Note: Use this to do REST Testing in REST Client extension in VSCode

POST http://localhost:5010/projects/1234/commands/6789
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
