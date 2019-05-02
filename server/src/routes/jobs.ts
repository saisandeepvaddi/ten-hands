import express from "express";
const router = express.Router({ mergeParams: true });

import { startJob } from "../controllers/jobs";

/* 
Self Note: Use this to do REST Testing in REST Client extension in VSCode
POST http://localhost:1010/projects/1234/jobs/5678
Content-Type: application/json

{
  "name": "test sai"
}

 */
router.post("/:jobId", startJob);

export default router;
