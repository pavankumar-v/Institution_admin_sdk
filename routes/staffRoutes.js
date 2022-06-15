import express from "express";
const router = express.Router();

import {
  staffControl,
  createStaffAuth,
  sendVerificationCode,
  viewStaff,
  loadSubjects,
} from "../controllers/staffController.js";

router.get("/staffcontrol", staffControl);
// router.post("/loadsubjects", loadSubjects);
router.post("/sendverificationcode", sendVerificationCode);
router.post("/createStaffAuth", createStaffAuth);
router.post("/viewStaff", viewStaff);
router.post("/renderSubjects", loadSubjects);

export default router;
