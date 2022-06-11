import express from "express";
const router = express.Router();

import {
  getForm,
  createForm,
  formStateToggle,
  deleteForm,
} from "../controllers/formController.js";

router.get("/dynamicform", getForm);
router.post("/createform", createForm);
router.post("/formStateToggle", formStateToggle);
router.post("/deleteform", deleteForm);

export default router;
