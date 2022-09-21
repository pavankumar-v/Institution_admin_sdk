import express from "express";
const router = express.Router();

import { getEventPage } from "../controllers/eventsController.js";
import curAuth from "../middleware/curAuth.js";

router.get("/events", curAuth, getEventPage);

export default router;
