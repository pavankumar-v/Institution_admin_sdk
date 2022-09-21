import express from "express";
const router = express.Router();

import {
  getForm,
  createForm,
  formStateToggle,
  deleteForm,
} from "../controllers/formController.js";

import curAuth from "../middleware/curAuth.js";

router.get("/dynamicform", curAuth, getForm);
router.post("/createform", createForm);
router.post("/formStateToggle", formStateToggle);
router.post("/deleteform", deleteForm);

export default router;
