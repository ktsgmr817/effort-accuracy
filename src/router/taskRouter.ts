import express from "express";
import { closed } from "../controller/taskController";

const router = express.Router();
router.post("/closed", closed);

export default router;
