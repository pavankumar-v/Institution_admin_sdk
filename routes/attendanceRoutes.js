import express from "express";

import {
  getAttendance,
  getAttendanceDate,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/attendance", getAttendance);
router.get("/attendanceParams?:date", getAttendanceDate);

export default router;
