import express from "express";
import { onAuthStateChanged } from "firebase/auth";

import {
  getDashboard,
  loadAttendanceChart,
} from "../controllers/darshboardController.js";
const router = express.Router();

router.get("/dashboard", getDashboard);
router.post("/loadattendancechart", loadAttendanceChart);

export default router;
