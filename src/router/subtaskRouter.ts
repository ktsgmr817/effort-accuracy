import express from "express";
import { done } from "../controller/subtaskController";

const router = express.Router();
router.post("/done", done);

export default router;
