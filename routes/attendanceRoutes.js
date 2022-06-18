import express from "express";

import {
  getAttendance,
  getAttendanceDate,
  loadAssignedSubjects,
  loadAttUsers,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/attendance", getAttendance);
router.get("/attendanceParams?:date", getAttendanceDate);
router.post("/loadattusers", loadAttUsers);
router.post("/loaddropdownsubjects", loadAssignedSubjects);

export default router;
