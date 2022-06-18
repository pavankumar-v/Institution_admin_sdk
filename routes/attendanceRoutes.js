import express from "express";

import {
  getAttendance,
  getAttendanceDate,
  loadAssignedSubjects,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/attendance", getAttendance);
router.get("/attendanceParams?:date", getAttendanceDate);
router.post("/loaddropdownsubjects", loadAssignedSubjects);

export default router;
