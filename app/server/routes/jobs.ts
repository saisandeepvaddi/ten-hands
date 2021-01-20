import express from "express";

import { startJob } from "../controllers/jobs";
const router = express.Router({ mergeParams: true });

/* 
Self Note: Use this to do REST Testing in REST Client extension in VSCode
POST http://localhost:5010/projects/75034ae2-c231-497d-a3d6-adb7048bb696/jobs/
Content-Type: application/json

{
  "commandId": "e1da46bc-22b9-47b5-abae-3b1523c07ddc"
}

 */

router.post("/", startJob);

export default router;
