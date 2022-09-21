import express from "express";

import {
  getNotificationPage,
  loadNotification,
  deletePost,
  createNotification,
} from "../controllers/notificationcontroller.js";

import curAuth from "../middleware/curAuth.js";

const router = express.Router();
router.get("/notifications", curAuth, getNotificationPage);
router.post("/loadnotifications", curAuth, loadNotification);
router.post("/createpost", curAuth, createNotification);
router.post("/deletepost", curAuth, deletePost);

export default router;
