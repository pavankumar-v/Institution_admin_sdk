import express from "express";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

import {
  loadSubjects,
  addModule,
  deleteModule,
  addNotes,
  deleteNotes,
} from "../controllers/subjectsController.js";

router.post("/loadSubjects", loadSubjects);
router.post("/addModule", addModule);
router.post("/deleteModule", deleteModule);
router.post("/deletenotes", deleteNotes);
router.post("/addNotes", upload.single("file"), addNotes);

export default router;
