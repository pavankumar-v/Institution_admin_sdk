import express from "express";
const router = express.Router();

import { loadSubjects } from "../controllers/subjectsController.js";

router.post("/loadSubjects", loadSubjects);

export default router;
