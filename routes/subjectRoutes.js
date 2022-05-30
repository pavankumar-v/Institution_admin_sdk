import express from "express";
const router = express.Router();

import { loadSubjects, addModule } from "../controllers/subjectsController.js";

router.post("/loadSubjects", loadSubjects);
router.post("/addModule", addModule);

export default router;
