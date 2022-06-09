import express from "express";
const router = express.Router();

import { getForm, createForm } from "../controllers/formController.js";

router.get("/dynamicform", getForm);
router.post("/createform", createForm);

export default router;
