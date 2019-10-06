import express from "express";
import { isValidPath, getGitInfo } from "../controllers/utilities";
const router = express.Router();

router.post("/is-valid-path", isValidPath);
router.post("/git-info", getGitInfo);

export default router;
