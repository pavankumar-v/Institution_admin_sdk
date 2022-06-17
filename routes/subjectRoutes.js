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
  addNewSubject,
  deleteSubject,
} from "../controllers/subjectsController.js";

router.post("/loadSubjects", loadSubjects);
router.post("/addnewsubject", addNewSubject);
router.post("/addModule", addModule);
router.post("/deletesubject", deleteSubject);
router.post("/deleteModule", deleteModule);
router.post("/deletenotes", deleteNotes);
router.post("/addNotes", upload.single("file"), addNotes);

export default router;
