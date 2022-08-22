import express from "express";
const router = express.Router();

import { getEventPage } from "../controllers/eventsController.js";

router.get("/events", getEventPage);

export default router;
