import express from "express";

import {
  getAttendance,
  getAttendanceDate,
} from "../controllers/attendanceController.js";

const router = express.Router();

// router.get("/:date/:branch/:sem/:section", getAttendance);
router.get("/attendance", getAttendance);
router.get("/attendanceParams?:date", getAttendanceDate);
// router.post("/", getAttendance);

export default router;

// const express = require("express");
// const { getAllUsers } = require("../controllers/userController");

// const router = express.Router();

// router.get("/dashboard", getAllUsers);

// module.exports = {
//   routes: router,
// };
