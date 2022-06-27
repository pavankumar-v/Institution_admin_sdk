import express from "express";
import { onAuthStateChanged } from "firebase/auth";

import {
  getDashboard,
  loadAttendanceChart,
  machineLearn,
  loadNotificationByTags,
} from "../controllers/darshboardController.js";
const router = express.Router();

router.get("/dashboard", getDashboard);
router.post("/loadattendancechart", loadAttendanceChart);
router.post("/machineLearning", machineLearn);
router.post("/loadNotificationbytags", loadNotificationByTags);

export default router;
