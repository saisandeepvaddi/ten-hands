import express from "express";
const router = express.Router();
import jobRoutes from "./jobs";
import commandRoutes from "./commands";

import {
  getAllProjects,
  addProject,
  deleteProject
} from "../controllers/projects";

// GET http://localhost:1010/projects
router.get("/", getAllProjects);

/* 
POST http://localhost:1010/projects
Content-Type: application/json

{
      "name": "Test3",
      "path": "C:\\Test2",
      "type": "node",
      "commands": [
        {
          "name": "start",
          "cmd": "npm run start",
          "execDir": "/src",
          "pid": ""
        }
      ]
}

*/
router.post("/", addProject);

/* 

DELETE http://localhost:1010/projects/3aa49e37-b58c-443d-a87c-5b35cd8b4345

*/
router.delete("/:projectId", deleteProject);

// Routes for commands
router.use("/:projectId/commands", commandRoutes);

// Routes for jobs.
// Difference between jobs and commands ?
// Command is plain JS Object about a command details like executionDirectory, project name, actual command etc.
// Job is a running process of that command
// It can be called simply process but there will be confustion about the actual process with pid running in OS which we are gonna use in Job
router.use("/:projectId/jobs/", jobRoutes);

export default router;
