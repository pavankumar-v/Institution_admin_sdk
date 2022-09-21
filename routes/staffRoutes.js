import express from "express";
const router = express.Router();

import {
  staffControl,
  createStaffAuth,
  sendVerificationCode,
  viewStaff,
  loadSubjects,
  assignSubjects,
  deleteSubjectVal,
  updateName,
  deleteStaffUser,
  claimToggle,
} from "../controllers/staffController.js";
import curAuth from "../middleware/curAuth.js";

router.get("/staffcontrol", curAuth, staffControl);
router.post("/sendverificationcode", sendVerificationCode);
router.post("/createStaffAuth", createStaffAuth);
router.post("/viewStaff/:id", curAuth, viewStaff);
router.post("/renderSubjects", loadSubjects);
router.post("/assignSubjects", assignSubjects);
router.post("/unassignsub", deleteSubjectVal);
router.post("/updateName", updateName);
router.post("/deleteStaffUser", deleteStaffUser);
router.post("/toggleclaim", claimToggle);

export default router;
