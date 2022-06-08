import express from "express";
import multer from "multer";

const router = express.Router();

import {
  loadSubjects,
  addModule,
  deleteModule,
  addNotes,
} from "../controllers/subjectsController.js";

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10000000000, files: 2 },
});

router.post("/loadSubjects", loadSubjects);
router.post("/addModule", addModule);
router.post("/deleteModule", deleteModule);
router.post("/addNotes", upload.array("file"), addNotes);

export default router;
