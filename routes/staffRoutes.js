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
} from "../controllers/staffController.js";

router.get("/staffcontrol", staffControl);
// router.post("/loadsubjects", loadSubjects);
router.post("/sendverificationcode", sendVerificationCode);
router.post("/createStaffAuth", createStaffAuth);
router.post("/viewStaff", viewStaff);
router.post("/renderSubjects", loadSubjects);
router.post("/assignSubjects", assignSubjects);
router.post("/unassignsub", deleteSubjectVal);
router.post("/updateName", updateName);
router.post("/deleteStaffUser", deleteStaffUser);

export default router;
