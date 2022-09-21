import express from "express";
import { onAuthStateChanged } from "firebase/auth";
import curAuth from "../middleware/curAuth.js";
import {
  getDashboard,
  loadAttendanceChart,
  machineLearn,
  loadNotificationByTags,
} from "../controllers/darshboardController.js";
const router = express.Router();

router.get("/dashboard", curAuth, getDashboard);
router.post("/loadattendancechart", loadAttendanceChart);
router.post("/machineLearning", machineLearn);
router.post("/loadNotificationbytags", loadNotificationByTags);

export default router;
