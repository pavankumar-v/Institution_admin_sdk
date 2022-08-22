import express from "express";

import {
  getAttendance,
  getAttendanceDate,
  loadAssignedSubjects,
  loadAttUsers,
  markAttendance,
  markAttendanceTest,
  reMarkAtt,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/attendance", getAttendance);
router.get("/attendanceParams?:date", getAttendanceDate);
router.post("/loadattusers", loadAttUsers);
router.post("/loaddropdownsubjects", loadAssignedSubjects);
router.post("/markattendance", markAttendance);
router.post("/remarkatt", reMarkAtt);

export default router;
