import express from "express";

import {
  getNotificationPage,
  loadNotification,
  deletePost,
  createNotification,
} from "../controllers/notificationcontroller.js";

const router = express.Router();
router.get("/notifications", getNotificationPage);
router.post("/loadnotifications", loadNotification);
router.post("/deletepost", deletePost);
router.post("/createpost", createNotification);

export default router;
