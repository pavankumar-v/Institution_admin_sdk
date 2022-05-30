import express from "express";
const router = express.Router();

import {
  loadSubjects,
  addModule,
  deleteModule,
} from "../controllers/subjectsController.js";

router.post("/loadSubjects", loadSubjects);
router.post("/addModule", addModule);
router.post("/deleteModule", deleteModule);

export default router;
