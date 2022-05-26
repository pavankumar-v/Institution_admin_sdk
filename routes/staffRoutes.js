import express from "express";
const router = express.Router();

import {
  staffControl,
  createStaffAuth,
} from "../controllers/staffController.js";

router.get("/staffcontrol", staffControl);
router.post("/createStaffAuth", createStaffAuth);

export default router;
