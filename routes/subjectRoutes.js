import express from "express";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

import {
  getSubject,
  loadSubjects,
  addModule,
  deleteModule,
  addNotes,
  deleteNotes,
  addNewSubject,
  deleteSubject,
} from "../controllers/subjectsController.js";
import curAuth from "../middleware/curAuth.js";

router.get("/subjects", curAuth, getSubject);
router.post("/loadSubjects", curAuth, loadSubjects);
router.post("/addnewsubject", curAuth, addNewSubject);
router.post("/addModule", addModule);
router.post("/deletesubject", deleteSubject);
router.post("/addNotes", upload.single("file"), addNotes);
router.post("/deleteModule", deleteModule);
router.post("/deletenotes", deleteNotes);

export default router;
