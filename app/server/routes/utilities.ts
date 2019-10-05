import express from "express";
import { isValidPath } from "../controllers/utilities";
const router = express.Router();

router.post("/is-valid-path", isValidPath);

export default router;
