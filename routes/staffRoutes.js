import express from "express";
const router = express.Router();

import {
  staffControl,
  createStaffAuth,
  sendVerificationCode,
  // loadSubjects
} from "../controllers/staffController.js";

router.get("/staffcontrol", staffControl);
// router.post("/loadsubjects", loadSubjects);
router.post("/sendverificationcode", sendVerificationCode);
router.post("/createStaffAuth", createStaffAuth);

export default router;
