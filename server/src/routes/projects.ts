import express from "express";
const router = express.Router();

import { getAllProjects, addProject } from "../controllers/projects";

router.get("/", getAllProjects);
router.post("/", addProject);

export default router;
