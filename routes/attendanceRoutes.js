import express from "express";

import {
  getAttendance,
  loadAssignedSubjects,
  loadAttUsers,
  markAttendance,
  reMarkAtt,
} from "../controllers/attendanceController.js";

import curAuth from "../middleware/curAuth.js";

const router = express.Router();

router.get("/attendance", curAuth, getAttendance);
router.post("/loadattusers", curAuth, loadAttUsers);
router.post("/loaddropdownsubjects", curAuth, loadAssignedSubjects);
router.post("/markattendance", markAttendance);
router.post("/remarkatt", reMarkAtt);

export default router;
